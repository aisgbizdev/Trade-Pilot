// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'refresh_fundamentals_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RefreshFundamentalsResponse extends RefreshFundamentalsResponse {
  @override
  final FundamentalContext fundamentalContext;
  @override
  final DateTime refreshedAt;
  @override
  final FundamentalDrift drift;

  factory _$RefreshFundamentalsResponse(
          [void Function(RefreshFundamentalsResponseBuilder)? updates]) =>
      (RefreshFundamentalsResponseBuilder()..update(updates))._build();

  _$RefreshFundamentalsResponse._(
      {required this.fundamentalContext,
      required this.refreshedAt,
      required this.drift})
      : super._();
  @override
  RefreshFundamentalsResponse rebuild(
          void Function(RefreshFundamentalsResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RefreshFundamentalsResponseBuilder toBuilder() =>
      RefreshFundamentalsResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RefreshFundamentalsResponse &&
        fundamentalContext == other.fundamentalContext &&
        refreshedAt == other.refreshedAt &&
        drift == other.drift;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, fundamentalContext.hashCode);
    _$hash = $jc(_$hash, refreshedAt.hashCode);
    _$hash = $jc(_$hash, drift.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RefreshFundamentalsResponse')
          ..add('fundamentalContext', fundamentalContext)
          ..add('refreshedAt', refreshedAt)
          ..add('drift', drift))
        .toString();
  }
}

class RefreshFundamentalsResponseBuilder
    implements
        Builder<RefreshFundamentalsResponse,
            RefreshFundamentalsResponseBuilder> {
  _$RefreshFundamentalsResponse? _$v;

  FundamentalContextBuilder? _fundamentalContext;
  FundamentalContextBuilder get fundamentalContext =>
      _$this._fundamentalContext ??= FundamentalContextBuilder();
  set fundamentalContext(FundamentalContextBuilder? fundamentalContext) =>
      _$this._fundamentalContext = fundamentalContext;

  DateTime? _refreshedAt;
  DateTime? get refreshedAt => _$this._refreshedAt;
  set refreshedAt(DateTime? refreshedAt) => _$this._refreshedAt = refreshedAt;

  FundamentalDriftBuilder? _drift;
  FundamentalDriftBuilder get drift =>
      _$this._drift ??= FundamentalDriftBuilder();
  set drift(FundamentalDriftBuilder? drift) => _$this._drift = drift;

  RefreshFundamentalsResponseBuilder() {
    RefreshFundamentalsResponse._defaults(this);
  }

  RefreshFundamentalsResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _fundamentalContext = $v.fundamentalContext.toBuilder();
      _refreshedAt = $v.refreshedAt;
      _drift = $v.drift.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RefreshFundamentalsResponse other) {
    _$v = other as _$RefreshFundamentalsResponse;
  }

  @override
  void update(void Function(RefreshFundamentalsResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RefreshFundamentalsResponse build() => _build();

  _$RefreshFundamentalsResponse _build() {
    _$RefreshFundamentalsResponse _$result;
    try {
      _$result = _$v ??
          _$RefreshFundamentalsResponse._(
            fundamentalContext: fundamentalContext.build(),
            refreshedAt: BuiltValueNullFieldError.checkNotNull(
                refreshedAt, r'RefreshFundamentalsResponse', 'refreshedAt'),
            drift: drift.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'fundamentalContext';
        fundamentalContext.build();

        _$failedField = 'drift';
        drift.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RefreshFundamentalsResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
