// Create closure and pass jquery as a dependency
var TabbedComponent = function (element) {

    // store element
    this.el = $(element);

    // reference elements
    this.nav = this.el.find('.tabbed-component__nav');
    this.list = this.el.find('.tabbed-component__list');

    // loop through nav elements and bind listener
    this.nav.on('click', this.onClickHandler.bind(this));

    this.currentTab = undefined; // reference to selected tab

    // set the initial data by get first tab. TODO make this a setting?
    this.setInitialTab(this.nav.find('a').first());

    // create loading message. TODO create nice loader
    this.loadingMsg = $('<li class="tabbed-component__loading">Loading</li>');

    // create error message. TODO create nicer error message/fallback?
    this.errorMsg = $('<li class="tabbed-component__loading">An error has occured.</li>');
}

TabbedComponent.prototype.setInitialTab = function (tab) {

    // start loading data
    this.setTab(tab);
}

TabbedComponent.prototype.onClickHandler = function (event) {

    var url;

    // stop default action
    event.preventDefault();

    // check if it's a link. This way we only need one listener
    if (event.target.nodeName === 'A') {

        this.setTab($(event.target));
    }

    // we're done so stop bubbling
    event.stopPropagation();
}

TabbedComponent.prototype.setTab = function (element) {

    var target = element,
        url;

    // remove active class from previous tab
    if (this.currentTab !== undefined) {
        this.currentTab.removeClass('active');
    }

    // add to the new one
    target.addClass('active');
    
    // store the url
    url = target.attr('href');

    // check if it's a string and start ajax request
    if ($.type(url) === 'string') {
        this.getData(url);
    }

    // store the current tab
    this.currentTab = target;
}

TabbedComponent.prototype.update = function (data) {
    
    var len = data.length,
        i = 0,
        item,
        headline,
        sub_text,
        data_item;

    // clear list
    this.list.empty();

    // loop through and create list items. // TODO make this more generic
    for (i; i < len; i++) {

        data_item = data[i];

        item = $('<li class="tabbed-component__list-item" />');

        headline = $('<h3><a href="' + data_item.webUrl + '">' + data_item.webTitle + '</a></h3>');

        sub_text = $('<p>' + data_item.fields.trailText + '</p>');

        item.append(headline);

        item.append(sub_text);

        // add to list. TODO batch into one DOM update
        this.list.append(item);
    }
};

TabbedComponent.prototype.getData = function (url) {

    // clear list and add loading message
    this.list.empty();
    this.list.append(this.loadingMsg);

    // start ajax request
    $.ajax({
        url: url,
        data: {
            format: 'json'
        },
        error: this.onErrorHandler.bind(this),
        dataType: 'jsonp',
        success: this.onSuccessHandler.bind(this),
        type: 'POST'
    });
};

TabbedComponent.prototype.onErrorHandler = function () {

    // clear list and add error message
    this.list.empty();
    this.list.append(this.errorMsg);
};

TabbedComponent.prototype.onSuccessHandler = function (data) {

    // on success update the list
    this.update(data.response.results);
};