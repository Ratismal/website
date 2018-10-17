var workspace = "brackets.html";

function get2(id) {
    workspace = id;
    swap();
}

function swap() {
    $(document).ready(function () {
        $('#working').load('workspaces/' + workspace);
    });
}