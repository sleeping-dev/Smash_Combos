﻿using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Smash_Combos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Smash_Combos.Core.Cqrs.Combos.DeleteCombo
{
    public class DeleteComboRequestHandler : IRequestHandler<DeleteComboRequest, DeleteComboResponse>
    {
        private readonly IMapper _mapper;
        private readonly IDbContext _dbContext;

        public DeleteComboRequestHandler(IDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<DeleteComboResponse> Handle(DeleteComboRequest request, CancellationToken cancellationToken)
        {
            var combo = await _dbContext.Combos.Where(combo => combo.Id == request.ComboId && combo.UserId == request.UserId).FirstOrDefaultAsync();
            if (combo == null)
            {
                return new DeleteComboResponse { Success = false };
            }

            _dbContext.Combos.Remove(combo);
            await _dbContext.SaveChangesAsync(CancellationToken.None);

            return new DeleteComboResponse { Success = true, Combo = _mapper.Map<ComboDto>(combo) };
        }
    }
}
