import React, { Component } from 'react';
import Event from './Event';

class EventList extends Component {
    render() {
        const { events } = this.props;

        return (
            <ul className="event-list">
                {events.map((event) => {
                    return (
                        <li key={event.id}>
                            <Event event={event}/>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default EventList;

// import React, { Component } from 'react';
// import Event from './Event';

// class EventList extends Component {
//   render() {
//     const { events } = this.props;
//     return (
//       <ul className="EventList">
//         {events.map((event) => (
//           <li key={event.id}>
//             <Event event={event} />
//           </li>
//         ))}
//       </ul>
//     );
//   }
// }

// export default EventList;