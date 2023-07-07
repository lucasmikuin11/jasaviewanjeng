var querystring = require('querystring');
const {
    CookieJar
} = require('tough-cookie');
const {
    wrapper
} = require('axios-cookiejar-support');
const axios = require("axios").default
const cheerio = require('cheerio');
const FormData = require("form-data")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomEmail() {
    var names = ['john', 'emma', 'alex', 'sarah', 'michael', 'olivia'];
    var domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
    var randomName = names[Math.floor(Math.random() * names.length)];
    var randomDomain = domains[Math.floor(Math.random() * domains.length)];
    var randomNameCode = generateRandomCode(10);
    var randomDomainCode = generateRandomCode(10);

    var randomEmail = randomName + randomNameCode + '@' + randomDomainCode + randomDomain;

    return randomEmail;
}

function generateRandomCode(length) {
    let code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

function generateRandomNumber() {
    var startingNumber = 62;
    var randomNumber = startingNumber.toString() + Math.floor(Math.random() * 10 ** 15).toString().padStart(15, '0');

    return randomNumber;
}

async function login(email, pass) {
    var login_data = querystring.stringify({
        email,
        pass
    })
    var jar = new CookieJar();

    var login = await axios.post("https://www.jasaview.id/masuk/action.php", login_data, {
        headers: {
            origin: 'https://www.jasaview.id',
            referer: 'https://www.jasaview.id/masuk/',
            "Content-Type": "application/x-www-form-urlencoded",
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }
    })
    var cookie = '';
    cookie = login.headers['set-cookie'][0].split(';')[0]
    var client = wrapper(axios.create({
        jar,
        headers: {
            cookie,
            'user-agent': 'Mozilla/5.0 (Linux; Android 12; CPH2199) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36'
        }
    }));
    return client
}

async function register() {
    var data = {
        user: "Bayar Semua WD LimaRatusRibu",
        email: generateRandomEmail(),
        pass: 'jokowarinokontol',
        pass2: 'jokowarinokontol'
    }
    var payload = querystring.stringify(data)
    var regist = await axios.post("https://www.jasaview.id/register/action.php", payload, {
        headers: {
            origin: 'https://www.jasaview.id',
            referer: 'https://www.jasaview.id/masuk/',
            "Content-Type": "application/x-www-form-urlencoded",
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
        }
    })
    //console.log(regist)
    return data
}

async function submit_ticket(id, client) {
    var url = 'https://www.jasaview.id/member/?p=confirm-tiket&page=1'
    var form = new FormData()
    form.append('id', id)
    form.append('tipe', 'viewori')
    form.append('akun', 'Bayar Semua WD 510K!!! WA : 085762342756')
    form.append('file', '')
    form.append('x', '')
    form.append('komentar', 'A')
    form.append('confirmtiket', '')
    var submit = (await client.post(url, form, {
        headers: {
            'origin': 'https://www.jasaview.id',
            'referer': url
        }
    })).data
}

async function iklan_like(client) {
    try {
        var i = 0;
        while (true) {
            i++
            var viewori = (await client.get('https://www.jasaview.id/member/?p=iklan-like&page=' + i))
            var $ = cheerio.load(viewori.data)
            var row_listad = $('div.row.listad')
            if (row_listad.length < 1) break
            var all_ids = [];
            $('.btn.btn-success.btn_ordertiket').each(function (index, element) {
                all_ids.push(element.parent.parent.attribs['data-id'])
            })
            if (all_ids.length > 0) {
                for (id of all_ids) {
                    var order_tiket = (await client.post('https://www.jasaview.id/member/ajax.php', JSON.stringify({
                        tipe: "ORDER_TIKET",
                        id
                    }), {
                        headers: {
                            'origin': 'https://www.jasaview.id',
                            referer: viewori.request.res.responseUrl
                        }
                    })).data
                    if (order_tiket.errcode === 'OK') {
                        console.log('[LIKE] SUCCESS')
                    }
                    await sleep(Math.random() * 2200)
                }
            }
            //await sleep(Math.random() * 2000)
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

async function iklan_komen(client) {
    try {
        var i = 0;
        while (true) {
            i++
            var viewori = (await client.get('https://www.jasaview.id/member/?p=iklan-komen&page=' + i))
            var $ = cheerio.load(viewori.data)
            var row_listad = $('div.row.listad')
            if (row_listad.length < 1) break
            var all_ids = [];
            $('.btn.btn-success.btn_ordertiket').each(function (index, element) {
                all_ids.push(element.parent.parent.attribs['data-id'])
            })
            if (all_ids.length > 0) {
                for (id of all_ids) {
                    var order_tiket = (await client.post('https://www.jasaview.id/member/ajax.php', JSON.stringify({
                        tipe: "ORDER_TIKET",
                        id
                    }), {
                        headers: {
                            'origin': 'https://www.jasaview.id',
                            referer: viewori.request.res.responseUrl
                        }
                    })).data
                    if (order_tiket.errcode === 'OK') {
                        console.log('[COMMENT] SUCCESS')
                    }
                    await sleep(Math.random() * 2200)
                }
            }
            //await sleep(Math.random() * 1000)
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

async function iklan_follow(client) {
    try {
        var i = 0;
        while (true) {
            i++;
            var viewori = await client.get('https://www.jasaview.id/member/?p=iklan-follow&page=' + i)
            //console.log(viewori.data)
            var $ = cheerio.load(viewori.data)
            var row_listad = $('div.row.listad')
            if (row_listad.length < 1) break
            var all_ids = [];
            $('.btn.btn-success.btn_ordertiket').each(function (index, element) {
                all_ids.push(element.parent.parent.attribs['data-id'])
            })
            if (all_ids.length > 0) {
                for (id of all_ids) {
                    var order_tiket = (await client.post('https://www.jasaview.id/member/ajax.php', JSON.stringify({
                        tipe: "ORDER_TIKET",
                        id
                    }), {
                        headers: {
                            'origin': 'https://www.jasaview.id',
                            referer: viewori.request.res.responseUrl
                        }
                    })).data
                    console.log(order_tiket)
                    if (order_tiket.errcode === 'OK') {
                        console.log('[FOLLOW] SUCCESS')
                    }
                    await sleep(Math.random() * 2200)
                }
            }
            //await sleep(Math.random() * 2000)
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

async function iklan_subs(client) {
    try {
        var i = 0;
        while (true) {
            i++
            var viewori = (await client.get('https://www.jasaview.id/member/?p=iklan-subs&page=' + i))
            var $ = cheerio.load(viewori.data)
            var row_listad = $('div.row.listad')
            if (row_listad.length < 1) break
            var all_ids = [];
            $('.btn.btn-success.btn_ordertiket').each(function (index, element) {
                all_ids.push(element.parent.parent.attribs['data-id'])
            })
            if (all_ids.length > 0) {
                for (id of all_ids) {
                    var order_tiket = (await client.post('https://www.jasaview.id/member/ajax.php', JSON.stringify({
                        tipe: "ORDER_TIKET",
                        id
                    }), {
                        headers: {
                            'origin': 'https://www.jasaview.id',
                            referer: viewori.request.res.responseUrl
                        }
                    })).data
                    if (order_tiket.errcode === 'OK') {
                        console.log('[SUBSCRIBE] SUCCESS')
                    }
                    await sleep(Math.random() * 2200)
                }
            }
            //await sleep(Math.random() * 2000)
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

async function iklan_view(client) {
    try {
        var i = 0;
        while (true) {
            i++
            var viewori = (await client.get('https://www.jasaview.id/member/?p=iklan-viewori&page=' + i))
            //console.log(viewori)
            var $ = cheerio.load(viewori.data)
            var row_listad = $('div.row.listad')
            //console.log(row_listad.length)
            if (row_listad.length < 1) break
            var all_ids = [];
            //console.log(all_ids)
            $('.btn.btn-success.btn_ordertiket').each(function (index, element) {
                //console.log(element)
                all_ids.push(element.parent.parent.attribs['data-id'])
            })
            //console.log(all_ids)
            if (all_ids.length > 0) {
                for (id of all_ids) {
                    var order_tiket = (await client.post('https://www.jasaview.id/member/ajax.php', JSON.stringify({
                        tipe: "ORDER_TIKET",
                        id
                    }), {
                        headers: {
                            'origin': 'https://www.jasaview.id',
                            referer: viewori.request.res.responseUrl
                        }
                    })).data
                    //console.log(order_tiket)
                    if (order_tiket.errcode === 'OK') {
                        //console.log('[VIEW] SUCCESS')
                        submit_ticket(order_tiket.id_order, client)
                    }
                    await sleep(Math.random() * 2200)
                }
            }
            await sleep(Math.random() * 5000)
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

async function start() {
    while (true) {
        var login_data = await register()
        console.log(login_data)
        var client = await login(login_data.email, login_data.pass)
        //console.log(client)
        await iklan_view(client)
    }
}
for (var i = 0; i < 15; i++) {
    start()
}
