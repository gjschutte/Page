from django.contrib import admin
from .models import Quote, Author, Genre

admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Quote)

