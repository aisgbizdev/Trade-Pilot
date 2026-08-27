// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_top_users_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStatsTopUsersInner
    extends AnalyticsTokenStatsTopUsersInner {
  @override
  final int userId;
  @override
  final String email;
  @override
  final int totalTokens;
  @override
  final num estimatedCostUsd;

  factory _$AnalyticsTokenStatsTopUsersInner(
          [void Function(AnalyticsTokenStatsTopUsersInnerBuilder)? updates]) =>
      (AnalyticsTokenStatsTopUsersInnerBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsTopUsersInner._(
      {required this.userId,
      required this.email,
      required this.totalTokens,
      required this.estimatedCostUsd})
      : super._();
  @override
  AnalyticsTokenStatsTopUsersInner rebuild(
          void Function(AnalyticsTokenStatsTopUsersInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsTopUsersInnerBuilder toBuilder() =>
      AnalyticsTokenStatsTopUsersInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsTopUsersInner &&
        userId == other.userId &&
        email == other.email &&
        totalTokens == other.totalTokens &&
        estimatedCostUsd == other.estimatedCostUsd;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, estimatedCostUsd.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsTopUsersInner')
          ..add('userId', userId)
          ..add('email', email)
          ..add('totalTokens', totalTokens)
          ..add('estimatedCostUsd', estimatedCostUsd))
        .toString();
  }
}

class AnalyticsTokenStatsTopUsersInnerBuilder
    implements
        Builder<AnalyticsTokenStatsTopUsersInner,
            AnalyticsTokenStatsTopUsersInnerBuilder> {
  _$AnalyticsTokenStatsTopUsersInner? _$v;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  int? _totalTokens;
  int? get totalTokens => _$this._totalTokens;
  set totalTokens(int? totalTokens) => _$this._totalTokens = totalTokens;

  num? _estimatedCostUsd;
  num? get estimatedCostUsd => _$this._estimatedCostUsd;
  set estimatedCostUsd(num? estimatedCostUsd) =>
      _$this._estimatedCostUsd = estimatedCostUsd;

  AnalyticsTokenStatsTopUsersInnerBuilder() {
    AnalyticsTokenStatsTopUsersInner._defaults(this);
  }

  AnalyticsTokenStatsTopUsersInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userId = $v.userId;
      _email = $v.email;
      _totalTokens = $v.totalTokens;
      _estimatedCostUsd = $v.estimatedCostUsd;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsTopUsersInner other) {
    _$v = other as _$AnalyticsTokenStatsTopUsersInner;
  }

  @override
  void update(void Function(AnalyticsTokenStatsTopUsersInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsTopUsersInner build() => _build();

  _$AnalyticsTokenStatsTopUsersInner _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsTopUsersInner._(
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'AnalyticsTokenStatsTopUsersInner', 'userId'),
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'AnalyticsTokenStatsTopUsersInner', 'email'),
          totalTokens: BuiltValueNullFieldError.checkNotNull(
              totalTokens, r'AnalyticsTokenStatsTopUsersInner', 'totalTokens'),
          estimatedCostUsd: BuiltValueNullFieldError.checkNotNull(
              estimatedCostUsd,
              r'AnalyticsTokenStatsTopUsersInner',
              'estimatedCostUsd'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
