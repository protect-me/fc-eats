require('./removeByValue')();

module.exports =  (io) => {

 let userList = []; //사용자 리스트를 저장할곳
 let userSocketId = {};

 io.on('connection', (socket) => {
    
     //아래 두줄로 passport의 req.user의 데이터에 접근한다.
     const session = socket.request.session.passport;
     const user = (typeof session !== 'undefined') ? ( session.user ) : "";

     // console.log(`소켓아이디 : ${socket.id}===========`);
  
     // 로그아웃 상태면 함수를 종료해 버린다.
     if(typeof user == 'undefined') return;
     userSocketId[user.id] = socket.id;

     socket.on('client order', ( data ) => {
       const socketId = userSocketId[data.user_id];
       socket.to(socketId).emit('server order');
     });

     // userList 필드에 사용자 명이 존재 하지 않으면 삽입
     if(!userList.includes(user.displayname)){
       userList.push(user.displayname);
     }
     io.emit('join', userList);

     //사용자 명과 메시지를 같이 반환한다.
     socket.on('client message', (data) => {
         io.emit('server message', { message : data.message , displayname : user.displayname });
     });

     socket.on('disconnect', () => {           
       userList.removeByValue(user.displayname);
       io.emit('leave', userList);
     });

 });
};