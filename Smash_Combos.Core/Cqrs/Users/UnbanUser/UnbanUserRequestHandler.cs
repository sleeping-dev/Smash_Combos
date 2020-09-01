﻿using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Smash_Combos.Core.Cqrs.Characters.GetCharacter;
using Smash_Combos.Core.Services;
using Smash_Combos.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Smash_Combos.Core.Cqrs.Users.UnbanUser
{
    public class UnbanUserRequestHandler : IRequestHandler<UnbanUserRequest, UnbanUserResponse>
    {
        private readonly IDbContext _dbContext;
        private readonly IMapper _mapper;

        public UnbanUserRequestHandler(IDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<UnbanUserResponse> Handle(UnbanUserRequest unbanRequest, CancellationToken cancellationToken)
        {
            var moderator = await _dbContext.Users.Where(user => user.Id == unbanRequest.ModeratorId).FirstOrDefaultAsync();

            if (moderator == null || (moderator.UserType != UserType.Moderator && moderator.UserType != UserType.Admin))
                return null;

            var user = await _dbContext.Users.Include(user => user.Combos)
                                .Include(user => user.Comments)
                                .Include(user => user.Combos)
                                .Include(user => user.Infractions)
                                .FirstOrDefaultAsync(user => user.Id == unbanRequest.UserId);

            if (user == null)
                return null;

            var infractions = await _dbContext.Infractions.Where(infraction => infraction.User.Id == unbanRequest.UserId).ToListAsync();

            foreach(var infraction in infractions)
            {
                if (infraction.IsActiveBan())
                {
                    infraction.BanLiftDate = DateTime.Now;
                }
            }

            await _dbContext.SaveChangesAsync(CancellationToken.None);

            return _mapper.Map<UnbanUserResponse>(user);
        }
    }
}