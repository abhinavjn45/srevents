const voteService = require('../services/voteService');
const settingsService = require('../services/settingsService');
const { generateBrowserFingerprint, validateTurnstile } = require('../utils/fingerprint');

// Submit vote
exports.submitVote = async (req, res, next) => {
    try {
        const { categoryId, creatorId, browserFingerprint, cookieToken, localStorageToken, turnstileToken } = req.body;

        // Validate required fields
        if (!categoryId || !creatorId || !browserFingerprint || !turnstileToken) {
            return res.status(422).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate Turnstile
        const isTurnstileValid = await validateTurnstile(turnstileToken);
        if (!isTurnstileValid) {
            return res.status(403).json({
                success: false,
                message: 'Suspicious Activity Detected'
            });
        }

        // Get settings to check voting period
        const settings = await settingsService.getSettings();
        
        if (!settings.global_voting_enabled) {
            return res.status(403).json({
                success: false,
                message: 'Voting Closed'
            });
        }

        const now = new Date();
        if (settings.voting_start && new Date(settings.voting_start) > now) {
            return res.status(403).json({
                success: false,
                message: 'Voting has not started yet'
            });
        }

        if (settings.voting_end && new Date(settings.voting_end) < now) {
            return res.status(403).json({
                success: false,
                message: 'Voting Closed'
            });
        }

        // Get or create vote device
        const device = await voteService.getOrCreateVoteDevice(
            browserFingerprint,
            cookieToken,
            localStorageToken,
            req.ip,
            req.get('user-agent')
        );
        const voteDeviceId = device.id;

        // Check for duplicate vote
        const hasVoted = await voteService.hasDeviceVotedInCategory(voteDeviceId, categoryId);
        if (hasVoted) {
            let message = 'You have already voted in this category.';
            
            // If the browser sent a cookie token but it doesn't match the one in DB, they cleared cookies
            if (device.cookie_token && cookieToken !== device.cookie_token) {
                message = 'Incognito Cheating (Already Voted)';
            } 
            // If they are sending the same cookie but from a new IP
            else if (device.latest_ip && req.ip !== device.latest_ip) {
                message = 'VPN Cheating (Not Allowed)';
            }

            return res.status(409).json({
                success: false,
                message: message
            });
        }

        // Record vote
        const voteId = await voteService.recordVote(
            categoryId,
            creatorId,
            voteDeviceId,
            req.ip,
            req.get('user-agent'),
            0
        );

        res.status(201).json({
            success: true,
            message: 'Vote submitted successfully.',
            data: { voteId }
        });
    } catch (error) {
        next(error);
    }
};

// Get voting status
exports.getVotingStatus = async (req, res, next) => {
    try {
        const settings = await settingsService.getSettings();

        res.json({
            success: true,
            data: {
                votingEnabled: settings.global_voting_enabled || false,
                votingStart: settings.voting_start,
                votingEnd: settings.voting_end
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user votes
exports.getMyVotes = async (req, res, next) => {
    try {
        const { browserFingerprint, cookieToken, localStorageToken } = req.body;

        if (!browserFingerprint) {
            return res.json({ success: true, data: {} });
        }

        const votes = await voteService.getDeviceVotes(
            browserFingerprint,
            cookieToken,
            localStorageToken
        );

        // Convert array of { category_id, creator_id } to Record<categoryId, creatorId>
        const votedCategories = votes.reduce((acc, vote) => {
            acc[vote.category_id] = vote.creator_id;
            return acc;
        }, {});

        res.json({
            success: true,
            data: votedCategories
        });
    } catch (error) {
        next(error);
    }
};
