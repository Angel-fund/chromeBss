var default_word = "浙江商安信息科技有限公司";
var accessToken = 'ea50d58ccdecb2208f93df68dd681c16';
var db;

function init_db(caller) {
    db = openDatabase("Bss360", "0.1", "Database for Bss360", 200000);
    db.transaction(function (tx) {
        tx.executeSql("SELECT COUNT(*) FROM `Word`", [],
        /* success */
        function(result) {
            update_db();
            if (caller == "app") {
                init_wordlist();
            }            
        },
        /* no table, create them  sequence*/
        function(tx, error) {
            tx.executeSql("CREATE TABLE `Word` (`id` REAL UNIQUE, `word` TEXT, `timestamp` REAL, `Eid` REAL, `status` REAL)", [],
            function() {
                localStorage.db_version = 2;
                storage_word(default_word,1245173);
                init_wordlist();
            },
            null);
            tx.executeSql("CREATE TABLE `Token` (`accessToken` TEXT )", [],
            function() {                
               insertToken(accessToken);        
            },
            null);
        });
    });
}

function insertToken(accessToken){
    db.transaction(function(tx) {        
        tx.executeSql("INSERT INTO `Token` (`accessToken`) values(?)",
        [accessToken],
        null, null);
    });
}
function updateToken(accessToken) {
    db.transaction(function(tx) {      
        tx.executeSql("UPDATE `Token` SET `accessToken` = ?",
        [accessToken],
        null, null);        
    });
}
function get_Token(func) {    
    db.transaction(function(tx) {
        tx.executeSql("SELECT `accessToken` FROM `Token`", [],
        function(tx, result) {
            func(result);
        }, null);
    });
}

function update_db() {
    if (!localStorage.db_version) {
        localStorage.db_version = 1;
    }
    
    console.log("Current db version: " + localStorage.db_version + ".");
    if (localStorage.db_version < 2) {
        db.transaction(function(tx) {
            tx.executeSql("ALTER TABLE `Word` ADD COLUMN `Eid` REAL", [], null, null);
            tx.executeSql("ALTER TABLE `Word` ADD COLUMN `status` REAL", [], null, null);
        });
        localStorage.db_version = 2;
    }
}

function storage_words(words) {
    var time = new Date().getTime();
    db.transaction(function(tx) {
        for (var w in words) {         
            tx.executeSql("DELETE FROM `Word` WHERE `word` = ?",
            [words[w]],
            null, null);
            tx.executeSql("INSERT INTO `Word` (`word`, `timestamp`,`Eid`) values(?, ?)",
            [words[w][0], time,words[w][1]],
            null, null);
        }
    });
}

function storage_word(word,Eid) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM `Word` WHERE `word` = ?",
        [word],
        null, null);
        tx.executeSql("INSERT INTO `Word` (`word`, `timestamp`, `Eid`) values(?, ?, ?)",
        [word, new Date().getTime(),Eid],
        null, null);
    });
}

function update_word_seq() {
    db.transaction(function(tx) {
        $("#wordlist li").each(function(id, obj) {
            tx.executeSql("UPDATE `Word` SET `Eid` = ? WHERE `word` = ?",
            [id, $(obj).text()],
            null, null);
        });
    });
}

function remove_all_word() {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM `Word`",
        null, null, null);
    });
}

function remove_word(word) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM `Word` WHERE `word` = ?",
        [word],
        null, null);
    });
}

function get_wordlist(process_func) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM `Word` ORDER BY `Eid` DESC, `timestamp` ASC", [],
        function(tx, result) {
            process_func(result);
        }, null);
    });
}

function is_word_exist(word, func) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT COUNT(*) AS `exist` FROM `Word` WHERE `word` = ?", [word],
        func, null);
    });
}