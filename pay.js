var options = {
    account: 32691195,
    amount: 12.34,
    transactionId: '1234567890-abcdef'
};

var assistant = new Assistant.Builder();

// платёж прошёл успешно
assistant.setOnSuccessCallback(function(operationId, transactionId) {
    // todo: здесь можно сделать что угодно – например, 
    // перенаправить на другую страницу:

});

// платёж не прошёл
assistant.setOnFailCallback(function(operationId, transactionId) {
    // todo: действия на ваш вкус
});

// платёж обрабатывается
assistant.setOnInProgressCallback(function(operationId, transactionId) {
    // todo: тоже можно что-нибудь придумать            
});

assistant.build(options, 'payment-form');
