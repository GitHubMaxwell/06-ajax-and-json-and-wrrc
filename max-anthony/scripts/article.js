'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// DONE COMMENT: Why isn't this method written as an arrow function?
// because inside the function the JS "this" is used inside it
Article.prototype.toHtml = function () {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);

  // DONE COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // ternary operation: this.publishedStatus will equal one or the other depending on which one resolves to true. in other words if this.publishedOn = true then it will equal the template literal with this.daysago and if its false it will equal the string 'draft'
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, however it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// DONE COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// The function is called within the Article.fetchAll function nested within the if and else statements; rawData now represents anything in localStorage. This is different from the previous lab in that we're using the getJSON call the data instead of having it in a local file. 
Article.loadAll = articleData => {
  articleData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
console.log('B4444444 FEEETTTCCCHHHHHH');

Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  // let url = '/data/hackerIpsum.json';
  // console.log(url);

  if (localStorage.rawData) {
    console.log('localStorage');
    Article.loadAll();

  } else {
    console.log('EEEEELLLLLLLSSSSSSEEEEEEE');
    //this is where the ajax call will go
    $.getJSON('./data/hackerIpsum.json')
      .then(data => {
        Article.loadAll(data)
        articleView.initIndexPage();
        //we had to getJSON first to retrieve the data from the hackerIpsum.json file; next the .then method is used to render the data onto the site; the .catch method returns an error if the data didn't load. 

      })
      .catch(err => console.error('DERRRP', err));

  }
}
