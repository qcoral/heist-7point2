"use client";

import { useState, useEffect } from "react";

import { DateTime } from "luxon";

export default function Home() {
	const [chatMessages, setChatMessages] = useState([]);
	const [triggerFetch, setTriggerFetch] = useState(false);
	const [, setUpdateTimer] = useState(0); // Add this line

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await fetch("https://heist-api.iunstable0.com/posts");
				const data = await response.json();
				setChatMessages(data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchMessages();

		// Add this interval
		const timer = setInterval(() => {
			setUpdateTimer((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer); // Cleanup on unmount
	}, [triggerFetch]);

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const body = JSON.stringify({
			name: formData.get("name"),
			room_num: formData.get("room"),
			message: formData.get("message"),
		});

		try {
			const response = await fetch("https://heist-api.iunstable0.com/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body,
			});

			if (!response.ok) throw new Error("Network response was not ok");
			console.log("Message sent successfully");
			setTriggerFetch(!triggerFetch);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<main>
			<div className="title">
				<h1>heist 7.2</h1>
			</div>

			<h1 className="cel">quick! who are you and what are you up to?</h1>
			<div>
				<form id="chatForm" onSubmit={handleSubmit}>
					<label className="cel">
						name:
						<input type="text" name="name" required />
					</label>
					<label className="cel">
						room #:
						<input type="text" name="room" />
					</label>
					<label className="cel">
						message:
						<input type="text" name="message" required maxLength={64} />
					</label>
					<div className="cell">
						<button type="submit">submit</button>
					</div>
				</form>

				<div className="chat-messages">
					{chatMessages.map((msg: any) => (
						<div className="chat-message" key={msg.id}>
							<strong>
								{DateTime.fromISO(msg.created_at).toRelative()} | {msg.name}:{" "}
								{msg.room_num}
							</strong>
							: {msg.message}
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
