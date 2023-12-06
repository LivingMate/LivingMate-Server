import express from 'express';
const app = express();
import router from './Routers/index'; 



// app.use('/feed', router); 
app.use('/calendar', router);

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중');
});








