# Generated by Django 5.1.3 on 2024-12-09 04:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0017_alter_task_create_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='create_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
