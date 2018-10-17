var file = "index.html";

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function blarg() {
    console.log(file);
    var file2 = file;
    $.get(file2, function (data) {
        $('.replace').remove();
        $('#content').html('<pre class="prettyprint linenums replace"></pre>');
        $('.replace').removeClass('lang-html').removeClass('lang-css').removeClass('lang-js').removeClass('prettyprinted');
        $('.replace').text(data);
        console.log(file2);
        if (endsWith(file2, '.html')) {
            $('.replace').addClass('lang-html');
        } else if (endsWith(file2, '.css')) {
            $('.replace').addClass('lang-css');
        } else if (endsWith(file2, '.js')) {
            $('.replace').addClass('lang-js');
        }
        prettyPrint();
        //alert('job done');
    });
}

function get(id) {
    //  console.log(id);
    file = id;
    // console.log(file);
    blarg();
}