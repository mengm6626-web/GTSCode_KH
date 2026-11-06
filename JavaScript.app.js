// JavaScript code extracted from index.html

// Secrets & Metadata Configuration
var VERSION_SECRETS = {
    11: { EU: "NewSupraLooksGreat", NA: "PcnM67n4fvDw", OT: "SKE48", JP: "d5kMnpJKjFuH" },
    12: { EU: "NewYarisGazooIsHot", NA: "aKyFHbQ2RuP6", OT: "SKE48", JP: "F0XE3NbAqBmY" },
    14: { EU: "GRSupra2019IsIconic", NA: "RzLjNAVNLUj2", OT: "SKE48", JP: "gaynyrGps4cA" },
    15: { EU: "YarisGRMNisHere0720", NA: "TxnEJmDGSFFN", OT: "SKE48", JP: "KGnJeyWWX7SQ" },
    16: { EU: "N3wL@ndCru1serGoesHybr1d", NA: "vXmN6XgUQjHM", OT: "SKE48", JP: "6Ix2V3mnktWJ" },
    17: { EU: "GRY4r1sW1nsRally1nK3nya", NA: "eS9VdRGeTMBc", OT: "SKE48", JP: "7Chxc3419YF2" },
    18: { EU: "MyPr1u5isS1ck85365", NA: "JxENR5GakyTw", OT: "SKE48", JP: "SVciaorlleett1118" }
};
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var REGION_META = {
    EU: { icon: "🇪🇺", label: "Europe" },
    NA: { icon: "🇺🇸", label: "North America" },
    OT: { icon: "🌍", label: "Global" },
    JP: { icon: "🇯🇵", label: "Japan" }
};

function $(id) { return document.getElementById(id); }
function md5(str) { return CryptoJS.MD5(str).toString(); }

// ==========================================
// 1. LOGIN SYSTEM
// ==========================================
function doLogin() {
    var p = $("password").value.trim();
    if (p === "sm@168") {
        $("loginScreen").style.display = "none";
        $("appScreen").style.display = "block";
    } else {
        $("loginError").classList.add("show");
        setTimeout(function() { $("loginError").classList.remove("show"); }, 3000);
        $("password").value = "";
    }
}

$("password").addEventListener("keypress", function(e) {
    if (e.key === "Enter") doLogin();
});

// ==========================================
// 2. GENERATE SYSTEM
// ==========================================
function getDateStr() {
    var d = new Date();
    return String(d.getDate()).padStart(2, "0") + String(d.getMonth() + 1).padStart(2, "0") + String(d.getFullYear()).slice(-2) + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0");
}

function getExpiryDate(days) {
    var e = new Date(Date.now() + days * 86400000);
    return String(e.getDate()).padStart(2, "0") + " " + MONTHS[e.getMonth()] + " " + e.getFullYear();
}

function generateCode(hwid, period, region, version) {
    var dateStr = getDateStr();
    var periodStr = String(period).padStart(4, "0");
    var secrets = VERSION_SECRETS[version];
    var hash = md5(hwid + version);
    return md5(hash + secrets[region] + periodStr + dateStr) + periodStr + dateStr;
}

function generateCodeJP(hwid, period, version) {
    var dateStr = getDateStr();
    var periodStr = String(period).padStart(4, "0");
    var secrets = VERSION_SECRETS[version];
    if (version === "11") {
        var hash = md5(hwid + version);
        return md5(hash + secrets.JP + periodStr + dateStr) + periodStr + dateStr;
    }
    var s = md5(periodStr + "Japan" + hwid);
    var o = md5(secrets.JP + dateStr + s + version);
    var d = dateStr.split(""), p = periodStr.split("");
    var l = d[0], E = d[1], S = d[2], g = d[3], u = d[4], c = d[5], _ = d[6], N = d[7], v = d[8], R = d[9];
    var J = p[0], m = p[1], p2 = p[2], y = p[3];
    var P = o.substring(0, 9);
    return o.substring(9, 21) + _ + N + m + S + g + v + l + E + u + c + p2 + y + o.substring(21, 27) + R + J + P + o.substring(27, 32);
}

function generateKeys() {
    var hwid = $("hwid").value.trim();
    var period = parseInt($("period").value, 10);
    var version = $("versionSelect").value;

    if (!hwid || hwid.length < 4) return alert("Software ID must be at least 4 characters");
    if (isNaN(period) || period < 1 || period > 6000) return alert("Period must be between 1 and 6000 days");

    var btn = $("generateBtn");
    btn.disabled = true;
    btn.textContent = "⏳ Generating...";

    setTimeout(function() {
        try {
            var codes = {
                EU: generateCode(hwid, period, "EU", version),
                NA: generateCode(hwid, period, "NA", version),
                OT: generateCode(hwid, period, "OT", version),
                JP: generateCodeJP(hwid, period, version)
            };
            renderResult(codes, period);
        } catch (err) {
            alert("Failed to generate codes.");
        } finally {
            btn.disabled = false;
            btn.textContent = "Generate Codes";
        }
    }, 10);
}

function renderResult(codes, period) {
    var expiry = getExpiryDate(period);
    var regions = ["EU", "NA", "OT", "JP"];
    var html = '<div class="expiry-box"><div class="expiry-label">⏳ Expiry Date</div><div class="expiry-date">' + expiry + '</div></div>';

    for (var i = 0; i < regions.length; i++) {
        var region = regions[i];
        var meta = REGION_META[region];
        html += '<div class="region-header"><span>' + meta.icon + ' ' + meta.label + ' (' + region + ')</span></div>';
        html += '<div class="region-code" onclick="copyCode(this)">' + codes[region] + '<span class="copy-hint">Copy</span></div>';
    }
    $("result").innerHTML = html;
    $("result").classList.add("show");
}

// Clipboard Copy & Toast Handler
function copyCode(element) {
    var text = element.innerText.replace("Copy", "").trim();
    navigator.clipboard.writeText(text).then(function() {
        element.classList.add("copied");
        
        var toast = $("toast");
        toast.classList.add("show");
        
        setTimeout(function() {
            element.classList.remove("copied");
            toast.classList.remove("show");
        }, 2000);
    });
}

// Enter Key Listeners
$("hwid").addEventListener("keypress", function(e) { if (e.key === "Enter") generateKeys(); });
$("period").addEventListener("keypress", function(e) { if (e.key === "Enter") generateKeys(); });