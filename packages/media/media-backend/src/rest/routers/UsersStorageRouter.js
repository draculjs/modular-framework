import express from 'express';
import { getUserStoragesByUsedPercentage } from '../../services/UserStorageService'
import { DefaultLogger as winston } from '@dracul/logger-backend'

const usersStorageRouter = express.Router();

function validatePercentage(percentage) {
    if (!percentage) {
        return {
            isValid: false,
            error: `A "percentage" parameter is needed!`
        }
    }
    
    const parsedPercentage = parseFloat(percentage)
    if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
        return {
            isValid: false,
            error: "Invalid percentage value. Percentage must be a number between 0 and 100."
        }
    }

    return { isValid: true, parsedPercentage }
}

usersStorageRouter.get('/usedStorage/:percentage', async function (req, res) {
    if (!req.user) res.status(401).json({ message: "Not Authorized" })

    const percentageValidation = validatePercentage(req.params.percentage)
    if (!percentageValidation.isValid) res.status(400).json({ message: percentageValidation.error })

    const usersStorage = await getUserStoragesByUsedPercentage(percentageValidation.parsedPercentage)
    if (usersStorage && usersStorage.length > 0) {
        res.status(200).json(usersStorage)
    } else {
        res.status(400).json({ message: `No user storages were found that have occupied more than ${percentageValidation.parsedPercentage}% of their total space`  })
    }
})

module.exports = usersStorageRouter;
export default usersStorageRouter;
