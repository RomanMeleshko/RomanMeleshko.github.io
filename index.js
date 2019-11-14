window.onload = function() {

  var arr_elemets_from_dom = document.getElementsByClassName("block_windows");
  var nodes = arr_elemets_from_dom[0].childNodes;

  var arr_images = ["images/crocodile.png", "images/dolphin.png",
                    "images/rabbit.png", "images/shake.png", "images/cat.png",
                    "images/audi.png"];

 // функция рандомных чисел
  function rundom(num) {
    return Math.floor(Math.random() * num);
  }

 // функция установки картинок в элементы li
  function setImagesToWindow(arr, children, li) {
    var new_arr = [];

     for(var i = 0; i < children.length; i++) {
       if(children[i].nodeName.toLowerCase() == "li") {

          new_arr.push(children[i]);
       }
     }

     for(var i = 0; i < new_arr.length; i++) {
        new_arr[i].innerHTML = "<img src='"+ arr[rundom(6)] +"'/>";

     }

    return new_arr;
  }

  // функция перерисовки заднего фона выбранных окон
  function updateBackground(arr, color, move) {
    arr.map(function(elem) {
      elem.style.background = color;
      elem.style.transform = move;
    });

  }

   var arrElemLi = setImagesToWindow( arr_images, nodes );

   var li = [];

   function setChooise(arrLi) {

   var div = document.getElementsByClassName("result");

     for(var i = 0; i < arrLi.length; i++) {
       arrLi[i].addEventListener("click", function() {

        li.push(this);

        updateBackground( li, "green", "rotate3d(2, 90, 2, 180deg)", 10);

         if(div[0].children.length != 2) {
            div[0].appendChild(this.firstChild);

          if(div[0].children.length == 2) {
            var one = div[0].firstElementChild.getAttribute("src");
            var two = div[0].lastElementChild.getAttribute("src");

              if(one == two) {
                setTimeout(function() {
                  showUserWinnerOrLoss("Поздравляем !");
                }, 1000);
              }else {
                setTimeout(function() {
                  showUserWinnerOrLoss("В следуюший раз...");
                }, 1000);
              }
           }
         }
       });
     }

   }
   setChooise( arrElemLi );

   // функция обнуления игрового поля
   function buttonTryAgaine() {
     var button = document.getElementsByClassName("button");
     var div = document.getElementsByClassName("result");
     var elemFromDomWinner = document.getElementsByClassName("winner");

     button[0].addEventListener("click", function(){
        setImagesToWindow( arr_images, nodes);
        updateBackground( li, "#283947", "rotate3d(2, 90, 2, 0deg)");
        li.length = 0;    //обнуляем массив выбранных элементов (окон)
        div[0].innerHTML = "";
        elemFromDomWinner[0].remove();
     });
   }
   buttonTryAgaine();

  // функция показывающая всплывающий popap 
   function showUserWinnerOrLoss(str) {
     var createNewElemDiv = document.createElement("div");
     createNewElemDiv.className = "winner";

     var createNewElemP = document.createElement("p");
     createNewElemP.innerHTML = str;

     createNewElemDiv.appendChild( createNewElemP );

     var elemFromDom = document.getElementsByClassName("block_windows");
     elemFromDom[0].appendChild( createNewElemDiv );
   }


}
