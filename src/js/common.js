(function(window, document) {
  "use strict";

  const retrieveURL = function(filename) {
    let scripts = document.getElementsByTagName("script");
    if (scripts && scripts.length > 0) {
      for (let i in scripts) {
        if (
          scripts[i].src &&
          scripts[i].src.match(new RegExp(filename + "\\.js$"))
        ) {
          return scripts[i].src.replace(
            new RegExp("(.*)" + filename + "\\.js$"),
            "$1"
          );
        }
      }
    }
  };

  function load(url, element) {
    let req = new XMLHttpRequest();

    req.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        element.insertAdjacentHTML("afterbegin", req.responseText);
      }
    };

    req.open("GET", url, true);
    req.send(null);
  }

  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.host !== ""
  ) {
    var files = ["/img/symbol_sprite.html"],
      revision = 10;

    if (
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    )
      return true;

    var isLocalStorage =
        "localStorage" in window && window["localStorage"] !== null,
      request,
      data,
      insertIT = function() {
        document.body.insertAdjacentHTML("afterbegin", data);
      },
      insert = function() {
        if (document.body) insertIT();
        else document.addEventListener("DOMContentLoaded", insertIT);
      };
    files.forEach(file => {
      try {
        let request = new XMLHttpRequest();
        request.open("GET", file, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            data = request.responseText;
            insert();
            if (isLocalStorage) {
              localStorage.setItem("inlineSVGdata", data);
              localStorage.setItem("inlineSVGrev", revision);
            }
          }
        };
        request.send();
      } catch (e) {}
    });
  } else {
    load("./img/symbol_sprite.html", document.querySelector("body"));
  }
})(window, document);

document.addEventListener("DOMContentLoaded", () => {
  const inputPhonePlugins = [];
  const inputPhones = document.querySelectorAll("[type='tel']");

  inputPhones.forEach(input => {
    inputPhonePlugins.push(
      window.intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup: function(success, failure) {
          $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
            var countryCode = resp && resp.country ? resp.country : "";
            success(countryCode);
          });
        }
      })
    );
    input.addEventListener("input", () => {
      const error = input.closest(".iti.input-error");
      if (error) {
        error.classList.remove("input-error");
      }
    });
  });
  //send form
  document.addEventListener("submit", e => {
    const registratioFile = "/registration.php";
    e.preventDefault();
    const form = e.target;

    const result = form.querySelector("button[type='submit']");
    const inputPhoneInForm = inputPhonePlugins.filter(input => {
      return input.a === form.querySelector("[type='tel']");
    })[0];

    const checkValid = inputPhoneInForm.isValidNumber();

    if (checkValid) {
      result.disabled = true;

      const btnText = result.innerHTML;

      result.innerHTML = ". . .";

      const formData = new FormData(form);

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const ref = window.document.referrer;
      const location = window.location;

      if (inputPhoneInForm) {
        formData.append(
          "phone",
          inputPhoneInForm.getNumber(intlTelInputUtils.numberFormat.E164)
        );
      }

      if (location) {
        formData.append("location", location);
      }

      if (ref) {
        formData.append("ref", ref);
      }

      fetch(registratioFile, {
        method: "POST",
        body: formData
      }).then(() => {
        result.innerHTML = "✔";
      });
    } else {
      const iti = form.querySelector(".iti");
      if (!iti.classList.contains("input-error")) {
        iti.classList.toggle("input-error");
      }
    }
  });

  let navbar = document.querySelector(".navbar-toggler");
  let overlay = document.querySelector(".collapse-overlay");
  navbar.addEventListener("click", function() {
    overlay.classList.toggle("show");
  });
  $(".multiple-items").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1444,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 1120,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 991,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
  $(".fade-item").slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1120,
        settings: {
          arrows: false
        }
      }
    ]
  });
});
