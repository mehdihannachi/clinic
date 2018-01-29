var nodemailer = require("nodemailer"),
    fs = require("fs"),
    smtpapi = require("./emailheaders"),
    _ = require("underscore"),
    path = require('path'),
    mandrillTransport = require('nodemailer-mandrill-transport'),
    _jsy = require('jsy'),
    // smstracker = require('./smstracker'),
    _request = require('request'),
    inlineBase64 = require('nodemailer-plugin-inline-base64'),
    appConfig = require('./../../config/app');
    



function sendMail(option) {
    var header = new smtpapi();

    var htmlcontent = getHtml(option.template);
    if (htmlcontent &&
        _jsy(option.to) &&
        !_jsy(option.subject).isEmpty() &&
        !_jsy(option.vars).isEmpty()) {
        htmlcontent = fillTemplate(htmlcontent, option.vars);
        if (option.footer)
            htmlcontent = htmlcontent + loadfooter();
        var from;
        if (option.isSMS) {
            from = "Centre Fertillia <notification" + Math.floor((Math.random() * 1000) + 1) + "@fertillia.com>";



        }
        else {
            from = "Fertillia <notification@fertillia.com>";


        }

    }
    header.addFilter('opentrack', 'enable', 0);
    var headers = {
        'x-smtpapi': header.jsonString()
    };
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(from);
    var to_email = new helper.Email(option.to);
    var subject = option.subject;
    var content = new helper.Content(option.isSMS ? 'text/plain' : 'text/html', htmlcontent);
    console.log(content)
    var mail = new helper.Mail(from_email, subject, to_email, content);
    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
        headers: headers
    });
    request.body.tracking_settings = {
        "click_tracking": {
            "enable": false,
            "enable_text": false
        },
        "open_tracking": {
            "enable": false,
        },
        "subscription_tracking": {
            "enable": false,
        }
    }
    console.log(request.body)
    if (!option.isSMS)
        sg.API(request, function(error, response) {
            if (!error) {}
        });
    // else{

    //     var smstrackers = new smstracker();
    //     smstrackers.phone = option.subject;
    //     smstrackers.codevf = option.vars.codevf;
    //     smstrackers.sendDate = new Date();
    //     smstrackers.sendSms = false;

    //insert sms information
    // var url = 'http://docteurysms.ddns.net:9092/sendsms?phone='+option.subject+'&text='+htmlcontent
    // if(appConfig.env && appConfig.env != "dev")
    //     _request(url, function (error, response, body) {
    //       if (!error && response.statusCode == 200) {
    //           //update set sent true
    //           smstrackers.sendSms = true;
    //         // console.log(body) 
    //       }
    //     })

    //     smstrackers.save(function() {
    //         console.log('************saved sms trackers');
    //     });
    // }



}

function getHtml(templateName) {
    try {
        var templatePath = "../content/mails/" + templateName + ".html";
        var templateContent = fs.readFileSync(path.join(__dirname, templatePath), encoding = "utf8")
        return templateContent;
    }
    catch (e) {
        return false;
    }
}

function getTransport() {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'docteurysms1234@gmail.com',
            pass: 'docteury2015'
        }
    };
    var transport = nodemailer.createTransport(smtpConfig);
    transport.use('compile', inlineBase64(options))
    return transport;
}

function fillTemplate(htmlcontent, vars) {
    var find,
        re;
    for (var k in vars) {
        if (vars.hasOwnProperty(k)) {
            find = '{{' + k + '}}';
            re = new RegExp(find, 'g');

            htmlcontent = htmlcontent.replace(re, vars[k]);
        }
    }
    return htmlcontent;
}

function loadfooter() {
    try {
        var templatePath = "../content/mails/footer.html";
        var templateContent = fs.readFileSync(path.join(__dirname, templatePath), encoding = "utf8")
        return templateContent;
    }
    catch (e) {
        return false
    }
}

module.exports = sendMail;
