from django.shortcuts import render
from django.views import generic
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Quote, Author, Genre
import requests

def home(request):
    """View function for the home page"""

    # Generate the counts of the objects
    num_quotes = Quote.objects.all().count()
    num_authors = Author.objects.all().count()
    num_genres = Genre.objects.all().count()

    # Number of visits to this view
    num_visits = request.session.get('num_visits', 0)
    request.session['num_visits'] = num_visits + 1

    # Prepare API call to get random quote
    category = 'leadership'
    api_url = 'https://api.api-ninjas.com/v1/quotes?category={}'.format(category)
    api_key = 'YNMvfdbpYW6tENuDnThW1Q==Do2UFUixjxEEGrsY'

    response = requests.get(api_url, headers={'X-Api-Key': api_key})
    if response.status_code == requests.codes.ok:
        print(response.text)
        rand_response = response.json()
        rand_quote = rand_response[0]['quote']
        rand_author = rand_response[0]['author']
    else: 
        print("Error:", response.status_code, response.text)
        rand_quote = ''
        rand_author = ''

    context = {
        'num_quotes': num_quotes,
        'num_authors': num_authors,
        'num_genres': num_genres,
        'num_visits': num_visits,
        'rand_quote': rand_quote,
        'rand_author': rand_author,
    }

    return render(request, 'home.html', context = context)

class QuoteListView(generic.ListView):
    model=Quote

class QuoteDetailView(generic.DetailView):
    model=Quote

class AuthorListView(generic.ListView):
    model=Author

class AuthorDetailView(generic.DetailView):
    model=Author

class GenreListView(generic.ListView):
    model=Genre

class GenreDetailView(generic.DetailView):
    model=Genre

class AuthorCreate(CreateView):
    model = Author
    fields = ['first_name', 'last_name']

class AuthorUpdate(UpdateView):
    model = Author
    fields = ['first_name', 'last_name']

class AuthorDelete(DeleteView):
    model = Author
    success_url = reverse_lazy('authors')

class QuoteCreate(CreateView):
    model = Quote
    fields = ['description', 'author', 'genre']

class QuoteUpdate(UpdateView):
    model = Quote
    fields = ['description', 'author', 'genre']

class QuoteDelete(DeleteView):
    model = Quote
    success_url = reverse_lazy('quotes')

class GenreCreate(CreateView):
    model = Genre
    fields = ['description']

class GenreUpdate(UpdateView):
    model = Genre
    fields = ['description']

class GenreDelete(DeleteView):
    model = Genre
    success_url = reverse_lazy('genres')

def barchart (request):
    """View function for the barchart page"""

    context = {}

    return render(request, 'barchart.html', context = context)

def scatterplot (request):
    """View function for the scatterplot page"""

    context = {}

    return render(request, 'scatterplot.html', context = context)

def heatmap (request):
    """View function for the heatmap page """

    context = {}

    return render(request, 'heatmap.html', context = context)
   
def choropleth (request):
    """View function for the choropleth page """

    context = {}

    return render(request, 'choropleth.html', context=context)

def treemap (request):
    """ View function for the treemap page """

    context = {}

    return render (request, "treemap.html", context = context)