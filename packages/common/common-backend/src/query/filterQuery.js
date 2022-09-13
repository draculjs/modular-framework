const filterQuery = (filters) => {

    let qs = {}

    if(filters){

        for(let filter of filters){

            if(!filter.value){
                continue
            }

            switch(filter.operator){
                case '=':
                case 'eq':
                    qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                    break;
                case 'contain':
                case 'regex':
                    qs[filter.field] = {...qs[filter.field], $regex: filter.value}
                    break;
                case 'in':
                    qs[filter.field] = {...qs[filter.field], $in: (Array.isArray(filter.value) ? filter.value : [filter.value])}
                    break;
                case '>':
                case 'gt':
                    qs[filter.field] = {...qs[filter.field], $gt: filter.value}
                    break;
                case '<':
                case 'lt':
                    qs[filter.field] = {...qs[filter.field], $lt: filter.value}
                    break;
                case '>=':
                case 'gte':
                    qs[filter.field] = {...qs[filter.field], $gte: filter.value}
                    break;
                case '<=':
                case 'lte':
                    qs[filter.field] = {...qs[filter.field], $lte: filter.value}
                    break;
                default:
                    qs[filter.field] = {...qs[filter.field], $eq: filter.value}
            }
        }

    }

    return qs
}

module.exports = filterQuery
module.exports.filterQuery = filterQuery
