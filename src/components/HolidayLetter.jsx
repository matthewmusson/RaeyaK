import { useNavigate } from 'react-router-dom'
import './HolidayLetter.css'

function HolidayLetter({ isDarkMode }) {
  const navigate = useNavigate()

  return (
    <div className="holiday-letter-page">
      <header className="holiday-letter-header">
        <h1>Holiday Letter 2025</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          Back
        </button>
      </header>

      <div className="holiday-letter-content">
        <div className="letter-body">
          <p>Raeya,</p>

          <p>
            I'm continuing a tradition your Ama, my mom, started for me when I was born. 
            Every year she would write Christmas letters for the family, cataloging everything we had done, how we'd 
            grown over the past year, and what the family had to look forward to. So here goes...
          </p>
            
          <p>
            2025 has been in large part characterized by <i>you</i>. Your mom found out she was pregnant with you in late March, a bit quicker
            than your parents expected. I found out you were on the way the night before my last finals of the year. 
            Your parents briefly debated whether or not to tell me in case it might be distracting, but they did and hey, those finals 
            went great!
          </p>

          <p>
            From there we all watched you grow in your mom's belly during the Summmer. You started to kick more and more, and your mom kept 
            track of your fruit of the week, from lemon, to orange, to your Granfaja's favorite nickname, sweet potato.  
          </p>

          <p>
            At the start of October, your mom started to feel a little sick, and sure enough the Doctor's told her she had a condition which 
            meant you needed to come out a whole 2 months earlier than expected! That was a very scary week for everyone. Your dad flew back from 
            from his trip to Norway, Auntie Layla flew from Hawaii, and everyone else drove to get to Berkeley as fast as they could. 
          
          </p>

          <p> 
            We all came to the Hospital that morning, gathered in the waiting room, and your mom, the badass she is, delivered you safe and sound. Your dad may 
            not want this story spread, but during delivery he was with your mom, there was a lot of blood, and at one point he almost fainted (just thought you should know). 
          </p>

          <p>
            And so, on the night of a full moon, you came onto the world stage. It was another month or so until you got big enough to leave the Nicu, but in November you were eating so well 
            you got to come home. And now I'm writing this on a lazy afternoon with you in Tahoe, while you're probably sleeping (you took awhile to stop being nocturnal). 
          </p>

          <p>
            It's hard to underemphasize how much of a magnet you've been for our family. You've enraptured everyone, and have brought us all closer together, in hopes of being around you, than we've 
            been in a while. 
          </p>

          <p>
            I hope that whenever you return to these letters, they act as a source of both comfort and interest, that they're informative of who your family was, how they've grown with you , and how you've grown with them.
          </p>
          
          <p>
            We all love you to <i>your</i> full moon 🌕 and back.
          </p>

          <p className="letter-signature">
            Merry Christmas and Happy New Year, <br /> 
            - Uncle Matt and your adoring Family
          </p>
        </div>
      </div>
    </div>
  )
}

export default HolidayLetter
