import React from 'react';

const Description = ({text}) => {
    if (!text) return null;
    return text
        .split('\n\n')
        .map((paragraph, i) => 
            <p key={i}>
                {paragraph
                    .split('\n')
                    .map((line, j) => 
                        <React.Fragment key={j}>
                            {line}<br/>
                        </React.Fragment>
                    )
                }
            </p>);
}

export default Description;