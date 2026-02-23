// variables
let btn = document.querySelector('.new-quote');
let quote = document.querySelector('.quote');
let person = document.querySelector('.person');
console.log(person)

const quotes = [
    {
        quote: 'Be yourself; everyone else is already taken.',
        person:'Oscar Wilde'
    },{
        quote: 'I am selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you cannot handle me at my worst, then you sure as hell donot deserve me at my best.',
        person:'Marilyn Monroe'
    },{
        quote: 'So many books, so little time.',
        person:'Frank Zappa'
    },{
        quote: 'Two things are infinite: the universe and human stupidity; and I am not sure about the universe.',
        person:'Albert Einstein'
    },{
        quote: 'Be who you are and say what you feel, because those who mind donot matter, and those who matter donot mind.',
        person:'Bernard M. Baruch'
    },{
        quote: 'You know you are in love when you canot fall asleep because reality is finally better than your dreams.',
        person:'Dr. Seuss'
    },{
        quote: 'You only live once, but if you do it right, once is enough.',
        person:'Mae West'
    },{
        quote: 'Be the change that you wish to see in the world.',
        person:'Mahatma Gandhi'
    },{
        quote: 'In three words I can sum up everything I have learned about life: it goes on.',
        person:'Robert Frost'
    },{
        quote: 'If you want to know what a man is like, take a good look at how he treats his inferiors, not his equals.',
        person:'J.K. Rowling'
    },{
        quote: 'If you tell the truth, you donot have to remember anything.',
        person:'Mark Twain'
    },{
        quote: 'I have learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.',
        person:'Maya Angelou'
    },{
        quote: 'To live is the rarest thing in the world. Most people exist, that is all.',
        person:'Oscar Wilde'
    }
];

btn.addEventListener("click", function(){
    let random = Math.floor(Math.random() * quotes.length);
    quote.innerText = quotes[random].quote;
    person.innerText = quotes[random].person;
});


