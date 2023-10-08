const Product = require('../models/product');

const getAllProductStatic = async (req, res) => {
    //throw new Error("testing async error")
  const products = await Product.find({price: { $gt: 30 }})
  .sort('price')
  .select('name price')
//   .limit(10)
//   .skip(5)
  res.status(200).json({hbHint:products.length, products,})
} 

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    console.log(req.query);
    const queryObj = {};
    if(featured){
        queryObj.featured = featured === 'true' ? true : false;
    }
    if(company){
        queryObj.company = company
    }
    if (name) {
        queryObj.name = { $regex: name, $options: 'i' };
      }

      if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObj[field] = { [operator]: Number(value) };
          }
        });
      }


    let result =  Product.find(queryObj); 
    // sort
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }else{
        result= result.sort('createdAt')
    }
    //select
    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2
    
    const products = await result
    res.status(200).json({hbHint:products.length, products,})
 } 

 module.exports ={
    getAllProductStatic,
    getAllProducts
 }