// Input validation utilities

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email) && email.length <= 255;
};

const validatePassword = (password) => {
    // At least 8 characters, must include uppercase, lowercase, number, special char
    if (typeof password !== 'string' || password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password)) return false;
    return true;
};

const validateId = (id) => {
    const parsed = parseInt(id, 10);
    return Number.isInteger(parsed) && parsed > 0 && parsed < 2147483647; // MySQL INT max
};

const validateString = (str, minLength = 1, maxLength = 255) => {
    return typeof str === 'string' && str.trim().length >= minLength && str.length <= maxLength;
};

const validateNumber = (num, min = 0, max = 2147483647) => {
    return typeof num === 'number' && Number.isInteger(num) && num >= min && num <= max;
};

const validateEnum = (value, allowedValues) => {
    return allowedValues.includes(value);
};

const validateDateTime = (dateStr) => {
    if (typeof dateStr !== 'string') return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
};

const validateBoolean = (value) => {
    return typeof value === 'boolean';
};

const validateCategory = (data) => {
    const errors = [];

    if (data.title !== undefined) {
        if (!validateString(data.title, 1, 255)) {
            errors.push('Title must be a string between 1 and 255 characters');
        }
    }

    if (data.description !== undefined) {
        if (!validateString(data.description, 0, 1000)) {
            errors.push('Description must be a string up to 1000 characters');
        }
    }

    if (data.displayOrder !== undefined) {
        if (!validateNumber(data.displayOrder, 1, 100)) {
            errors.push('Display order must be a number between 1 and 100');
        }
    }

    if (data.status !== undefined) {
        if (!validateEnum(data.status, ['Active', 'Inactive'])) {
            errors.push('Status must be either "Active" or "Inactive"');
        }
    }

    if (data.votingStart !== undefined && data.votingStart !== null) {
        if (!validateDateTime(data.votingStart)) {
            errors.push('Voting start must be a valid ISO datetime');
        }
    }

    if (data.votingEnd !== undefined && data.votingEnd !== null) {
        if (!validateDateTime(data.votingEnd)) {
            errors.push('Voting end must be a valid ISO datetime');
        }
    }

    // If both dates provided, start must be before end
    if (data.votingStart && data.votingEnd) {
        if (new Date(data.votingStart) >= new Date(data.votingEnd)) {
            errors.push('Voting start must be before voting end');
        }
    }

    return { isValid: errors.length === 0, errors };
};

const validateCreator = (data) => {
    const errors = [];

    if (data.categoryId !== undefined) {
        if (!validateId(data.categoryId)) {
            errors.push('Category ID must be a valid positive integer');
        }
    }

    if (data.creatorName !== undefined) {
        if (!validateString(data.creatorName, 1, 255)) {
            errors.push('Creator name must be a string between 1 and 255 characters');
        }
    }

    if (data.bio !== undefined) {
        if (!validateString(data.bio, 0, 1000)) {
            errors.push('Bio must be a string up to 1000 characters');
        }
    }

    if (data.instagram !== undefined) {
        if (data.instagram !== null && !validateString(data.instagram, 1, 255)) {
            errors.push('Instagram handle must be a string up to 255 characters');
        }
    }

    if (data.youtube !== undefined) {
        if (data.youtube !== null && !validateString(data.youtube, 1, 255)) {
            errors.push('YouTube handle must be a string up to 255 characters');
        }
    }

    if (data.displayOrder !== undefined) {
        if (!validateNumber(data.displayOrder, 1, 1000)) {
            errors.push('Display order must be a number between 1 and 1000');
        }
    }

    if (data.status !== undefined) {
        if (!validateEnum(data.status, ['Active', 'Inactive'])) {
            errors.push('Status must be either "Active" or "Inactive"');
        }
    }

    return { isValid: errors.length === 0, errors };
};

const validateSettings = (data) => {
    const errors = [];

    if (data.event_name !== undefined) {
        if (!validateString(data.event_name, 1, 255)) {
            errors.push('Event name must be a string between 1 and 255 characters');
        }
    }

    if (data.event_description !== undefined) {
        if (!validateString(data.event_description, 0, 2000)) {
            errors.push('Event description must be a string up to 2000 characters');
        }
    }

    if (data.voting_start !== undefined && data.voting_start !== null) {
        if (!validateDateTime(data.voting_start)) {
            errors.push('Voting start must be a valid ISO datetime');
        }
    }

    if (data.voting_end !== undefined && data.voting_end !== null) {
        if (!validateDateTime(data.voting_end)) {
            errors.push('Voting end must be a valid ISO datetime');
        }
    }

    if (data.global_voting_enabled !== undefined) {
        if (!validateBoolean(data.global_voting_enabled)) {
            errors.push('Global voting enabled must be a boolean');
        }
    }

    if (data.footer_text !== undefined) {
        if (!validateString(data.footer_text, 0, 500)) {
            errors.push('Footer text must be a string up to 500 characters');
        }
    }

    return { isValid: errors.length === 0, errors };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateId,
    validateString,
    validateNumber,
    validateEnum,
    validateDateTime,
    validateBoolean,
    validateCategory,
    validateCreator,
    validateSettings
};
