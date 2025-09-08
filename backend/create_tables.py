from database import Base, engine
from models.stack import Stack  # import your Stack model

# Create all tables defined in Base
Base.metadata.create_all(bind=engine)

print("Tables created successfully")
