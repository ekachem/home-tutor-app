import React from "react";

export default function TopicSelector({ topic, onChange }) {
  return (
    <div className="selector">
      <label htmlFor="topic">Choose a topic: </label>
      <select
        id="topic"
        value={topic}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="addition">Addition</option>
        <option value="subtraction">Subtraction</option>
        <option value="multiplication">Multiplication</option>
        <option value="division">Division</option>
        <option value="fractions">Fractions</option>
      </select>
    </div>
  );
}

