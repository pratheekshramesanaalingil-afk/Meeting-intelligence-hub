# Meeting-intelligence-hub
The Problem - t acts as a smart assistant for meetings, where users can ask questions and get accurate, context-based answers derived from stored documents (such as transcripts, notes, or PDFs). The system combines semantic search with a local language model to ensure responses are relevant, concise, and grounded in actual meeting content.
tech stack used - 
So in here i used python for my back end and javascript for front end used fast api for the connection between front and back ends
so the embedding model used here is the hugging face embedding model the reason i used hugging faced embedding model is because of its fast retrival speed
i used semantic chunking here beacuse of the very high quality chunking it produces for the rag systems
used chroma db here because of its vector storage and high efficiency
used tiny ollama beacuse didnt have enough for popular llms like chat gpt or gemini 
used hyde retrival beacuse while using tiny ollama it may produce answers which may be wrong so by using hyde retirval we can reduce this by using hyde retrival
Setup Instructions - so first need to run the tiny ollama model from the windows powershell
then need to run the python file through the command prompt and then need to check whether it has been deployed so since i used http://127.0.0.1:8000/ so we need to insert it into the browser
then we need to start the front end we also start them in the command prompt
