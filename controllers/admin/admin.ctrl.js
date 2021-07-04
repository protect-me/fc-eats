const models = require("../../models");

exports.get_shops = async (req, res) => {
  const paginate = require("express-paginate")
  try {
    const [ shops, totalCount ] = await Promise.all([
      models.Shops.findAll({
        limit : req.query.limit,
        offset : req.offset,
        order: [['createdAt', "desc"]]
      }),
      models.Shops.count()
    ])

    const pageCount = Math.ceil( totalCount / req.query.limit );
    const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);

    res.render("admin/shops.html", { shops, pages, pageCount });
  } catch (e) {}
};

exports.get_shops_write = (req, res) => {
  res.render("admin/form.html", { csrfToken: req.csrfToken() });
};

exports.post_shops_write = async (req, res) => {
  req.body.geo = {
    type: "Point",
    coordinates: [req.body.geo.split(",")[0], req.body.geo.split(",")[1]],
  };
  try {
    req.body.thumbnail = req.file ? req.file.filename : "";
    await models.Shops.create(req.body);
    res.redirect("/admin/shops");
  } catch (e) {
    console.log(e);
  }
};

exports.get_shops_detail = async (req, res) => {
  try {
    const shop = await models.Shops.findOne({
      where: {
        id: req.params.id,
      },
      include: ["Menu"],
    });

    res.render("admin/detail.html", { shop });
  } catch (e) {
    console.log(e);
  }
};

exports.get_shops_edit = async(req, res) => {
  try{
      const shop = await models.Shops.findOne({
          where : { id : req.params.id},
          include : [
              { model : models.Tag, as : 'Tag' }
          ],
          order: [
              [ 'Tag', 'createdAt', 'desc' ]
          ]
      });
      res.render('admin/form.html', { shop , csrfToken : req.csrfToken() });
  }catch(e){
  } 
}

exports.post_shops_edit = async (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const uploadDir = path.join(__dirname, "../../uploads");

  req.body.geo = {
    type: "Point",
    coordinates: [req.body.geo.split(",")[0], req.body.geo.split(",")[1]],
  };

  try {
    const shop = await models.Shops.findByPk(req.params.id);

    // req에 파일 요청이 있고, 파일에 썸네일이 있을 경우 unlinkSync삭제
    if (req.file && shop.thumbnail) {
      fs.unlinkSync(uploadDir + "/" + shop.thumbnail);
    }
    req.body.thumbnail = req.file ? req.file.filename : shop.thumbnail;
    await models.Shops.update(req.body, {
      where: { id: req.params.id },
    });
    res.redirect("/admin/shops/detail/" + req.params.id);
  } catch (e) {}
};

exports.get_shops_delete = async (req, res) => {
  try {
    await models.Shops.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/admin/shops");
  } catch (e) {}
};

exports.add_menu = async (req, res) => {
  try {
    const shop = await models.Shops.findByPk(req.params.id);
    // create + as에 적은 내용 ( shops.js association 에서 적은 내용 )
    await shop.createMenu(req.body);
    res.redirect("/admin/shops/detail/" + req.params.id);
  } catch (e) {
    console.log(e);
  }
};

exports.remove_menu = async (req, res) => {
  try {
    await models.ShopsMenu.destroy({
      where: {
        id: req.params.menu_id,
      },
    });
    res.redirect("/admin/shops/detail/" + req.params.shop_id);
  } catch (e) {
    console.log(e);
  }
};

exports.get_order = async (_, res) => {
  const orders = await models.Checkout.findAll();
  res.render("admin/order.html", { orders });
};

exports.get_order_edit = async (req, res) => {
  try {
    const checkout = await models.Checkout.findOne({
      where: {
        id: req.params.id,
      },
      include: ["Menu", "Shop", "User"],
    });
    res.render("admin/order_edit.html", { checkout });
  } catch (e) {}
};

exports.post_order_edit = async(req,res) => {
  try{
      await models.Checkout.update(
          req.body ,
          {
              where : { id: req.params.id }
          }
      );
      res.redirect('/admin/order');
  }catch(e){
  }
}

exports.write_tag = async (req, res) => {
  try {
      const tag = await models.Tag.findOrCreate({
          where: {
              name : req.body.name
          }
      });

      const shop = await models.Shops.findByPk(req.body.shop_id);
      const status = await shop.addTag(tag[0]);

      console.log("status", status);
      console.log("tag", tag);

      res.json({
          status : status,
          tag : tag[0]
      })

  } catch (e) {
      res.json(e)
  }
}

exports.delete_tag = async (req, res) => {
  try {
      const shop = await models.Shops.findByPk(req.params.shop_id);
      const tag = await models.Tag.findByPk(req.params.tag_id);

      const result = await shop.removeTag(tag);
     
      res.json({
          result : result
      });
  } catch (e) {

  }
}