export const logApiAction = async (logData) => {
  try {
    const logResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/apilog/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      }
    );

    if (!logResponse.ok) {
      const errorData = await logResponse.json();
      console.error("Failed to log API action:", errorData);
      throw new Error(errorData.error || "Failed to log API action");
    }
    return await logResponse.json();
  } catch (error) {
    console.error("Error logging API action:", error);
    throw error;
  }
};
