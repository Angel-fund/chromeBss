chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        init_db();
        if (request.method == "find") {
            is_word_exist(request.word, function(tx, result) {
                sendResponse( {exist: result.rows.item(0).exist} );
            });
            return true;
        }
        else if (request.method == "Token") {
            get_Token(function(tx, result) {
               console.log(result);
                sendResponse(result);
            });
            return true;  
        }
        else if (request.method == "add") {
            // console.log('selection',id);
            storage_word(request.word,request.id);
        }
        else if (request.method == "remove") {
            remove_word(request.word);
        }
    }
);