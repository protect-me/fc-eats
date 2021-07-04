const { Router } = require('express');
const router = Router();
const models = require('../../models');

router.get('/', async ( req , res )=>{

 try{
   const shops = await models.Shops.findAll({

     include : [ 'Tag' ],

     ...( req.query.lat && req.query.lng ?
    
     {
       attributes: {

         include : [
           [
             models.sequelize.literal(`
               ST_DISTANCE_SPHERE( POINT(
                   ${req.query.lng},
                   ${req.query.lat}
                 ), geo)`
               ) ,
               'distance'
           ]
         ]


       },
      
       order  : [ [ models.sequelize.literal('distance'), 'asc' ] ]
        
     }

     : ''),

     where : {
         ...(
         // 검색어가 있는 경우
         ('name' in req.query && req.query.name) ?
         {
             // + 태그에서 가져옴 or
             [models.Sequelize.Op.or] : [
                 models.Sequelize.where( models.Sequelize.col('Tag.name') , {
                     [models.Sequelize.Op.like] : `%${req.query.name}%`
                 }),
                 {
                     'name' : {
                         [models.Sequelize.Op.like] : `%${req.query.name}%`
                     }
                 }
             ],
         }
         :
         '' ),
     }
   });
   res.render('home.html', { shops });   
 }catch(e){
   console.log(e);
 }


});

module.exports = router;



