
module.exports = (function () {

  function Chart() {
    return {
      helpers: {
        extend: function () {}
      }
    };
  }

  global['Chart'] = Chart();

  return Chart();
});
