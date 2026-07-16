const dashboardService = require('../services/dashboardService');

// Get dashboard summary
exports.getDashboard = async (req, res, next) => {
    try {
        const summary = await dashboardService.getDashboardSummary();

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

// Get votes
exports.getVotes = async (req, res, next) => {
    try {
        const { category, creator, page = 1, limit = 20, isFlagged } = req.query;

        const filters = {
            categoryId: category ? parseInt(category) : null,
            creatorId: creator ? parseInt(creator) : null,
            isFlagged: isFlagged ? isFlagged === 'true' : undefined
        };

        const result = await dashboardService.getVotes(filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: result.votes,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                pages: result.pages
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get vote statistics
exports.getStatistics = async (req, res, next) => {
    try {
        const statistics = await dashboardService.getVoteStatistics();

        res.json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};

// Export votes (CSV)
exports.exportVotes = async (req, res, next) => {
    try {
        const { format = 'csv' } = req.query;

        const result = await dashboardService.getVotes({}, 1, 10000);

        if (format === 'csv') {
            // Generate CSV
            let csv = 'ID,Category,Creator,IP,Risk Score,Flagged,Date\n';
            
            result.votes.forEach(vote => {
                csv += `${vote.id},"${vote.category_title}","${vote.creator_name}",${vote.ip_address},${vote.risk_score},${vote.is_flagged ? 'Yes' : 'No'},${vote.created_at}\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="votes.csv"');
            res.send(csv);
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid format'
            });
        }
    } catch (error) {
        next(error);
    }
};
