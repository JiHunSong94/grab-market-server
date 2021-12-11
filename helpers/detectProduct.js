const tf = require('@tensorflow/tfjs-node'); // tensorflow 노드 불러와서 tf 함수 만들기
const mobilenet = require('@tensorflow-models/mobilenet'); // mobilenet은 이미 만들어져 있음
const fs = require('fs'); // node환경에서 파일을 불러오고 읽을 수 있는 라이브러리 fs

module.exports = function detectProduct(url, callback) {
  // url는 파일의 주소. 이미지 파일에 주소를 넣었을 때 이 함수가 해당 이미지를 읽고 mobilenet에 입력하고 그 결과를 반환해주는 함수.
  // mobilenet은 CNN(이미지같은 2차원 데이터를 위한 모델)을 따른다. rgb가 각각의 값을 가지고 있다. 2차원 데이터에 층이 3개(R,G,B)가 생긴다.
  const image = fs.readFileSync(url, callback); // 파일을 동기적으로 불러오겠다. async는 비동기,FileSync는 동기여서 파일을 읽어올때까지 밑에 로직이 실행되지 않는다.
  const input = tf.node.decodeImage(image, 3); // 이미지를 mobilenet에 입력하려면 기본적으로 tensor형태로 만들어줘야 한다. 3은 rgb 층
  mobilenet.load().then((model) => {
    // 모델을 로드, 비동기처리 promise 형태, 모델을 로드하게 되면 callback 함수의 첫번째 인자인 model이 들어간다.
    model.classify(input).then((result) => {
      // classify를 통해 input이 무엇인지 분석한다.
      callback(result[0].className); // 여기 callback 함수는 밑에 detectProduct의 function(data)로 들어가게 된다.
    });
  });
};
