function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}

$( document ).ready(function() {
    $(".bag").addClass('hidden');
    if(getCookie('carts')){
        $(".bag").removeClass('hidden');
    }
    $(".addToCartBtn").on("click", function () {
        var cookieArr
        var id = $(this).data("id");
        var getCookieCarts = getCookie('carts');
        if (getCookieCarts) {
            cookieArr = JSON.parse(getCookieCarts);
        }else{
            cookieArr = new Array();
        }
        cookieArr.push(id);
        setCookie('carts', JSON.stringify(cookieArr), {
            expires: 60 * 60 * 24 * 30
        });
        $(".bag").removeClass('hidden');
    });

    if($(".active.bag").length > 0 && getCookie('carts')){
        $.ajax({
            type: 'POST',
            url: '/bag',
            dataType: "json",
            data: { cookie : getCookie('carts') },
            success: function(data){
                console.log(data);
                for (var i = 0; i < data.length ; i++) {
                    var quantity = 0
                    // var howMany = data.find(data[i]._id)
                    // if (dhowMany.length > 1) {
                    //     quantity++
                    // }
                    $( "tbody" ).append(
                        "<tr>"
                        +"<td>"+"<img class='img-responsive' alt='500x500' src='"+data[i].picture+"' >"+"</td>"
                        +"<td>"+data[i].name+"</td>"
                        +"<td>"+data[i].balance+"</td>"
                        +"<td>"+quantity+"</td>"
                        +"</tr>"
                    );
                }
            },
            error: function (err) {
                console.log(err.error);
            }
        });

        $(".mkOrdr").on("click", function (e) {
            e.preventDefault();
            var orderName = $(".orderName").val();
            if(orderName <2){
                $(".table-responsive").after("<small>more than two letters required</small>");
            }else{
                $.ajax({
                    type: 'POST',
                    url: '/bag/order',
                    dataType: "json",
                    data: { 
                        cookie : getCookie('carts'),
                        name: orderName
                    },
                    success: function(data){
                        console.log(data);
                        deleteCookie("carts");
                        $( ".container.marketing" ).empty();
                        $(".container.marketing").append("<h1>"+"Thank you, "+data+"</h1>")
                    },
                    error: function (err) {
                        console.log(err.error);
                    }
                }); 
            }
        });
    };
});