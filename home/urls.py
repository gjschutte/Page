from django.urls import path
from home import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('quotes/', views.QuoteListView.as_view(), name='quotes'),
    path('quote/<int:pk>', views.QuoteDetailView.as_view(), name='quote-detail'),
    path('authors/', views.AuthorListView.as_view(), name='authors'),
    path('author/<int:pk>', views.AuthorDetailView.as_view(), name='author-detail'),
    path('genres/', views.GenreListView.as_view(), name='genres'),
    path('genre/<int:pk>', views.GenreDetailView.as_view(), name='genre-detail'),
    path('author/create/', views.AuthorCreate.as_view(), name='author-create'),
    path('author/<int:pk>/update/', views.AuthorUpdate.as_view(), name='author-update'),
    path('author/<int:pk>/delete/', views.AuthorDelete.as_view(), name='author-delete'),
    path('quote/create/', views.QuoteCreate.as_view(), name='quote-create'),
    path('quote/<int:pk>/update/', views.QuoteUpdate.as_view(), name='quote-update'),
    path('quote/<int:pk>/delete/', views.QuoteDelete.as_view(), name='quote-delete'),
    path('genre/create/', views.GenreCreate.as_view(), name='genre-create'),
    path('genre/<int:pk>/update/', views.GenreUpdate.as_view(), name='genre-update'),
    path('genre/<int:pk>/delete/', views.GenreDelete.as_view(), name='genre-delete'),
    path('barchart/', views.barchart, name='barchart'),
    path('scatterplot', views.scatterplot, name='scatterplot'),
    path('heatmap', views.heatmap, name='heatmap'),
    path('choropleth', views.choropleth, name='choropleth'),
    path('treemap/', views.treemap, name='treemap'),
]