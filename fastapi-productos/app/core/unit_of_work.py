from sqlmodel import Session, create_engine
from app.core.database import engine

class AbstractUnitOfWork:
    def __init__(self, db_engine=None):
        self._engine = db_engine or engine
        self.session: Session | None = None

    def __enter__(self):
        self.session = Session(self._engine)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            if exc_type is not None:
                self.rollback()
            else:
                self.commit()
            self.session.close()

    def commit(self):
        if self.session:
            self.session.commit()

    def rollback(self):
        if self.session:
            self.session.rollback()
