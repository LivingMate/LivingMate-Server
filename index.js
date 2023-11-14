var 이름 = 'kim'; //이름이라는 변수를 만들건데요 거기에는 스트링만 들어올 수 있습니다
var 이름2 = ['kim', 'park']; //string만 담을 수 있는 어레이를 만들거에요. 
var 이름3 = { name: 'kim' }; //object 타입 지정, 해당 오브젝트와 똑같은 모양 만든 후 이름에는 이런 모양만 들어갈 수 있습니다
var 이름4 = {}; //name 속성이 들어올 수도 있고 안 들어올 수도 있어요. 옵션이에욤
var 이름5 = 3; //다양한 타입이 들어올 수 있는 union type
var 이름6 = 123; //string 타입이 가득 담긴 array혹은 넘버가 들어올 수 있어여
var 이름7 = 123;
//함수 타입 지정도 가능
function 함수(x) {
    return x * 2;
} //처음의 number는 파라미터 type, 뒤의 number는 함수의 type
var john = [123, true];
var john2 = { name: 'kim', age: 'twenty', major: 'Entrepreneurship' };
var User = /** @class */ (function () {
    function User(name) {
        this.name = 'kim';
    }
    return User;
}());
