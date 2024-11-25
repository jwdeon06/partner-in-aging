import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import toast from 'react-hot-toast';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00'
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title) {
      const dateTime = new Date(`${newEvent.date}T${newEvent.time}`);
      setEvents([...events, { ...newEvent, dateTime }]);
      setShowEventForm(false);
      setNewEvent({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00'
      });
      toast.success('Event added successfully');
    }
  };

  const getDayEvents = (date) => {
    return events.filter(event => 
      format(new Date(event.dateTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
        >
          Add Event
        </button>
      </div>

      {showEventForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {daysInMonth.map(date => {
          const dayEvents = getDayEvents(date);
          return (
            <div
              key={date.toString()}
              className={`min-h-[100px] p-2 border ${
                !isSameMonth(date, currentDate) ? 'bg-gray-50' : 'bg-white'
              } ${isToday(date) ? 'border-primary-500' : 'border-gray-200'}`}
            >
              <div className="text-right text-sm text-gray-600">
                {format(date, 'd')}
              </div>
              <div className="mt-1">
                {dayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="text-sm p-1 mb-1 bg-primary-100 text-primary-800 rounded truncate"
                  >
                    {format(new Date(event.dateTime), 'HH:mm')} - {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;