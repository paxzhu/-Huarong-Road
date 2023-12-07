// import { useState, useEffect } from "react";

// const App = () => {
//     const [posts, setPosts] = useState([]);
//     useEffect(() => {
//         fetch('http://127.0.0.1:5000/getShuffled')
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data);
//                 setPosts(data);
//             })
//             .catch((err) => console.log(err.message))
//      }, []);
     

//     return (
//         <div className="posts-container">
//            {posts.map((post, i) => {
//               return (
//                  <div className="post-card" key={i}>
//                     <h2 className="post-title">{post.title}</h2>
//                     <p className="post-body">{post.body}</p>
//                     <div className="button">
//                     <div className="delete-btn">Delete</div>
//                     </div>
//                  </div>
//               );
//            })}
//         </div>
//     );
// };

// export default App;

import React, { useState, useEffect } from 'react';
const demo = [
                [1, 6, 2],
                [5, 4, 7],
                [0, 3, 8]
            ]
const App = () => {
    const [puzzle, setPuzzle] = useState([]);
    const [reference, setReference] = useState(null);
    const getReference = async (puzzle) => {
        await fetch('http://127.0.0.1:5000/reference', {
            method: 'POST',
            body: JSON.stringify({
                puzzle: puzzle,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setReference(data);
                setPuzzle([]);
            })
            .catch((err) => {
                console.log(err.message);
            });
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        getReference(puzzle);
    };
    let status = null;
    if(reference) {
        status = JSON.stringify(reference)+ ", with steps: " + reference.length ;
    }
    return (
        <div className="app">
            <div className="add-post-container">
                <form onSubmit={handleSubmit}>
                    <button type="submit" onClick={() => setPuzzle(demo)}>Reference</button>
                </form>
            </div>
            <h4>{status}</h4>
        </div>
    );
};

export default App;