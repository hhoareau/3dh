function cutParams(params) {
    var ps = {};
    var keys = [];
    params.split("&").forEach((param) => {
        keys.push(param.split("=")[0]);
        ps[param.split("=")[0]] = param.split("=")[1].split(",");
    });
    keys.push("sup");
    keys.push("sup2");
    keys.push("sup3");
    ps["sup"] = [0];
    ps["sup2"] = [0];
    ps["sup3"] = [0];
    let l_p = [];
    for (var i = 0; i < ps[keys[0]].length; i++)
        for (var j = 0; j < ps[keys[1]].length; j++)
            for (var k = 0; k < ps[keys[2]].length; k++)
                for (var l = 0; l < ps[keys[3]].length; l++) {
                    let c1 = ps[keys[0]][i];
                    let c2 = ps[keys[1]][j];
                    let c3 = ps[keys[2]][k];
                    let c4 = ps[keys[3]][l];
                    var obj = {};
                    obj[keys[0]] = c1;
                    if (c2 != null)
                        obj[keys[1]] = c2;
                    if (c3 != null)
                        obj[keys[2]] = c3;
                    if (c4 != null)
                        obj[keys[3]] = c4;
                    l_p.push(obj);
                }
    var rc = [];
    l_p.forEach((val) => {
        var s = "";
        for (var p in val)
            s = s + p + "=" + val[p] + "&";
        rc.push(s.substr(0, s.length - 1));
    });
    return rc;
}
function showlink(document, multiple = false) {
    var domain = document.location.protocol + document.location.host;
    debugger;
    if (!domain.endWitdh("/"))
        domain = domain + "/";
    var notif = document.getElementById("email").value;
    var format = document.getElementById("format").value;
    var file = document.getElementById("url").value;
    if (file == null || file.length == 0)
        file = document.getElementById("lst_files").value;
    var algo = document.getElementById("algo").value.split(":")[0];
    var pca = document.getElementById("pca").value;
    var params = document.getElementById("params").value;
    for (var i = 0; i < 10; i++)
        params = params.replace("\n", " ").replace("<br>", " ");
    for (var i = 0; i < 10; i++)
        params = params.replace("  ", " ");
    for (var i = 0; i < 10; i++)
        params = params.replace(" ", "&");
    if (params[0] == ' ')
        params = params.substr(1, params.length);
    var job_name = "job" + new Date().getTime();
    if (!multiple) {
        let url_file = file;
        if (file.startsWith("http"))
            url_file = "b64=" + btoa(file);
        let url = "http://" + domain + "job/" + url_file + "/" + algo + "/" + params + "?&pca=" + pca;
        if (file.endsWith(".gml") || file.endsWith(".gexf") || file.endsWith(".gephi") || file.endsWith(".graphml")) {
            url = "http://" + domain + "graph/" + url_file + "/fr?algo_comm=gn";
        }
        //Ajout d'options supplémentaire sur l'url
        if (notif.length > 0)
            url += "&notif=" + notif;
        if (format != null) {
            format = format.toLowerCase().replace("colonnes", "cols").replace("col=", "cols=").replace("index", "name");
            for (var i = 0; i < 15; i++)
                format = format.replace(" ", "_").replace(";", "_");
            format = format.replace("val=", "measures=").replace("values=", "measures=").replace("mesure=", "measures=").replace("vals=", "measures=").replace("mesures=", "measures=").replace("artefact=", "measures=");
            for (var i = 0; i < 10; i++)
                format = format.replace("=", ":").replace("&", "_");
            if (format.length > 0)
                url += "&format=" + format;
        }
        if (document.getElementById("notext").checked)
            url = url + "&notext=True";
        if (document.getElementById("nometrics").checked)
            url = url + "&nometrics=True";
        if (document.getElementById("property").checked)
            url = url + "&property=True";
        document.getElementById("result").innerHTML = "<a target=_blank href='" + url + "'>" + url + "</a>";
        return [url];
    }
    else {
        //Traitement complexe
        let urls = [];
        cutParams(params).forEach((p) => {
            let url = "http://" + domain + "job/" + file + "/" + algo + "/" + p + "?pca=" + pca + "&notif=" + notif;
            urls.push(url);
        });
        return urls;
    }
}
function showParameters(document) {
    var algo = document.getElementById("algo").value.split("::")[0];
    var params = document.getElementById("algo").value.split("::")[1];
    //this.openIn(document.getElementById("algo").value.split("::")[2],"out");
    for (var i = 0; i < 10; i++)
        params = params.replace(" ", "\n");
    document.getElementById("params").value = params;
    if (algo == "NEURALGAS" && document.getElementById("email").value == "")
        document.getElementById("email").value = "dev@f80.fr";
    showlink(document);
}
export function testDownload(document) {
    var file = document.getElementById("url").value;
    if (file.indexOf("http") != 0)
        file = "/datas/" + file;
    window.open(file, "blank_");
}
export function hourglass(document, show = true) {
    if (show)
        document.getElementById("hourglass").style.visibility = "visible";
    else
        document.getElementById("hourglass").style.visibility = "hidden";
}
/**
 * Envoi les fichiers sur le serveur via l'api
 */
export function postFile(document, _public = false) {
    let file = document.getElementById("file").files[0];
    var formData = new FormData();
    formData.append('files', file);
    hourglass(document);
    fetch("/datas/measure/" + file.name + "?public=" + _public, {
        method: "POST",
        body: formData
    })
        .then(response => {
        return response.json();
        hourglass(false);
    })
        .then(r => {
        document.getElementById("url").value = file.name;
        hourglass(false);
        refreshFiles(document);
    }).catch((r) => {
        alert("Pas de connexion" + r);
    });
}
var start = 0;
function log(document, s) {
    if (document.getElementById("console").style.height != "100px") {
        document.getElementById("console").style.height = "100px";
        document.getElementById("console").style.maxHeight = "100px";
        document.getElementById("console").innerHTML = "";
    }
    var delay = Math.round((new Date().getTime() - start) / 1000);
    var format = Math.round(delay / 60) + ":" + (delay % 60);
    var new_s = format + " - " + s + "<br>" + document.getElementById("console").innerHTML;
    document.getElementById("console").innerHTML = new_s.substr(0, 300);
}
function clear_log(document) {
    start = new Date().getTime();
    document.getElementById("console").innerHTML = "";
    document.getElementById("console").style.height = "0px";
}
/**
 * Lance l'execution de plusieurs requetes sur le serveur
 */
function runAll(url, document) {
    var max_jobs = Number(document.getElementById("jobs").value);
    var urls = showlink(true);
    var waiting = "&nbsp;<img src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/ab79a231234507.564a1d23814ef.gif' style='width:25px'>";
    document.getElementById("nTreatments").innerHTML = urls.length + " running" + waiting;
    var i = 0;
    var n_jobs = 0;
    clear_log(document);
    var handle = setInterval(() => {
        if (n_jobs < max_jobs) {
            hourglass(true);
            n_jobs++;
            log(document, "On lance un nouveau job." + n_jobs + " en cours");
            fetch(url + "&nometrics=True").then((res) => { return res; }).then((res) => {
                i++;
                n_jobs--;
                log(document, "Fin d'un job." + n_jobs + " actifs");
                if (i == urls.length) {
                    hourglass(false);
                    clearInterval(handle);
                    openlink(document);
                    clear_log(document);
                    document.getElementById("nTreatments").innerHTML = "treatment ended";
                }
                else {
                    document.getElementById("nTreatments").innerHTML = (urls.length - i) + " treatments" + waiting;
                }
            }).catch(() => {
                log(document, "probable saturation du serveur. Diminuer le nombre de taches simultanés");
                i = url.length;
                document.getElementById("nTreatments").innerHTML = "treatment abort";
            });
        }
    }, 300);
}
var hLog = null;
function showLog() {
    if (hLog != null)
        clearInterval(hLog);
    hLog = setInterval(() => {
        window.open("/log", "out");
    }, 10000);
}
function hideLog() {
    if (hLog != null) {
        clearInterval(hLog);
        hLog = null;
    }
}
function analyseFile(document) {
    var url = btoa(document.getElementById("url").value);
    window.open("/analyse/" + url, "out");
}
function openlink(document) {
    window.open("./static/wait.html?mail=" + document.getElementById("email").value, "out");
    setTimeout(() => {
        window.open(showlink(document, false)[0], "out");
    }, 500);
}
function refreshFiles(document) {
    fetch("/datas/measures").then((r) => { return r.json(); }).then((lst) => {
        let rc = [];
        lst.forEach((f) => {
            if (!f.startsWith("temp"))
                rc.push("<option>" + f + "</option>");
        });
        document.getElementById("lst_files").innerHTML = rc.join(" ");
        document.getElementById("lst_files").options.selectedIndex = 0;
        showlink(document);
    });
}
//# sourceMappingURL=tools.js.map