import torch
import asyncio
from concurrent.futures import ThreadPoolExecutor

class StoryGenerator:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.executor = ThreadPoolExecutor(max_workers=2) # Prevent OOM by limiting concurrent generation

    def load_model(self, model_path: str):
        """Loads the model ONCE on startup."""
        print(f"Loading model from {model_path} onto {self.device}...")
        try:
            # Example loading logic for HF Transformers:
            # from transformers import AutoModelForCausalLM, AutoTokenizer
            # self.model = AutoModelForCausalLM.from_pretrained(model_path).to(self.device).eval()
            # self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            
            # Place holder for the user to inject their specific logic
            print("Model loaded successfully.")
            self.model = True # acts as a loaded flag for now
        except Exception as e:
            print(f"Error loading model: {e}")

    def _generate_sync(self, prompt: str, max_length: int = 100):
        """Standard synchronous pytorch generation."""
        if not self.model:
            return "Model not loaded."
        
        # Example dummy generation:
        # inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        # with torch.no_grad():
        #     outputs = self.model.generate(**inputs, max_length=max_length)
        # return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        import time
        time.sleep(2) # simulate heavy computation
        return f"[Generated Story based on: '{prompt}']\n\nOnce upon a time..."

    async def generate_async(self, prompt: str, max_length: int = 100):
        """Asynchronously wrap the synchronous generation."""
        loop = asyncio.get_running_loop()
        # run in thread pool so we don't block the fastapi event loop
        return await loop.run_in_executor(
            self.executor,
            self._generate_sync,
            prompt,
            max_length
        )

story_engine = StoryGenerator.get_instance()
