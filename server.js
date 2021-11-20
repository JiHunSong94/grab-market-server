const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(
  '/uploads',
  express.static(
    'uploads'
  ) /* 서버에서는 uploads 안에 있는 파일들을 입력했던 경로와 다른 경로(크롬 사용자설정에 있는 경로)로 보여줘야하기 때문에
  이미지를 받아서 해당 imageurl에 맞춰서 node 서버에 있는 이미지를 불러왔다.*/
);

app.get('/banners', (req, res) => {
  models.Banner.findAll({
    // findAll은 다양한 객체의 속성을 넣을 수 있다.
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((erorr) => {
      console.error(erorr);
      res.status(500).send('에러가 발생했습니다.');
    });
});

app.get('/products', (req, res) => {
  models.Product.findAll({
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl'],
  })
    .then((result) => {
      console.log('PRODUCTS : ', result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('에러 발생');
    });
});

app.post('/products', (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send('모든 필드를 입력해주세요'); // status가 200으로 보내지기 때문에 구분하기 위해, 400 -> 사용자가 잘못 했다.
  }
  models.Product.create({
    description,
    price,
    seller,
    imageUrl,
    name,
  })
    .then((result) => {
      console.log('상품 생성 결과 : ', result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('상품 업로드에 문제가 발생했습니다');
    });
});

app.get('/products/:id', (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log('PRODUCT : ', result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('상품 조회에 에러가 발생했습니다');
    });
});

// 업로드 페이지에서 image를 올리면 uploads에 이미지가 저장된다.
app.post('/image', upload.single('image'), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  models.sequelize
    .sync()
    .then(() => {
      console.log('DB 연결 성공!');
    })
    .catch((err) => {
      console.error(err);
      console.log('DB 연결 에러ㅠ');
      process.exit();
    });
});
