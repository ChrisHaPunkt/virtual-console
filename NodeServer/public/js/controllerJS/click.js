/**
 * Created by michaelschleiss on 29.10.15.
 */
$('.myButton').mousedown(buttonwaspressed);
$('.myButton').mouseup(buttonwasreleased);

function buttonwaspressed(button){
    console.log($(this).attr('id') + 'ist gedrückt worden');
}

function buttonwasreleased(){
    console.log($(this).attr('id') + "ist losgelesassen worden");
}