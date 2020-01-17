var express = require('express')
var ejs     = require('ejs')
var mysql   = require('mysql')
var source  = { user: 'james',     password: 'bond', 
                host: '127.0.0.1', database: 'magic', port: 3306}
// var source  = 'mysql://james:bond@127.0.0.1:3306/magic'
var pool    = mysql.createPool(source)

var server  = express() // create server
server.engine('html', ejs.renderFile)
server.listen(2000)
server.get('/api/list-product', listProduct)
server.get('/', showHome)
server.get('/login', showLogInPage)
server.get('/detail', showDetail)
server.get('/search', showSearchResult)

function listProduct(req, res) {
    pool.query('select * from product', function(error, data) {
        res.send(data)
    })
}

function showHome(req, res) {
    res.render('index.html')
}

function showSearchResult(req, res) {
    var model = { }
    model.result = [ ]
    if (req.query.text == null) {
        res.render('search-result.html', model)
    } else {
        var sql  = 'select * from product where name like ?'
        var data = [ '%' + req.query.text + '%' ]
        pool.query(sql, data, function(error, data) {
            model.result = data
            res.render('search-result.html', model)
        })
    }
}
function showLogInPage(req, res) {
    res.render('login.html')
}
function showDetail(req, res) {
    res.render('detail.html')
}