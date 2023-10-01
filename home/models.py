from django.db import models
from django.urls import reverse

class Genre(models.Model):
    description = models.CharField(max_length = 100, help_text='Enter a description for the genre')

    def __str__(self):
        return self.description

    def get_absolute_url(self):
        """ Return the URL to access a detail record """
        return reverse('genre-detail', args=[str(self.id)])

class Quote(models.Model):
    description = models.CharField(max_length=400, help_text='Enter the description')
    author = models.ForeignKey('Author', on_delete=models.SET_NULL, null=True)
    genre = models.ForeignKey('Genre', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.description

    def get_absolute_url(self):
        """ Return the URL to access a detail record """
        return reverse('quote-detail', args=[str(self.id)])
    
class Author(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    class Meta:
        ordering = ['last_name', 'first_name']

    def get_absolute_url(self):
        return reverse('author-detail', args=[str(self.id)])
    
    def __str__(self):
        return f'{self.last_name}, {self.first_name}'
    