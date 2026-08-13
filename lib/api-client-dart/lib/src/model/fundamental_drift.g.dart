// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_drift.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FundamentalDrift extends FundamentalDrift {
  @override
  final int totalCitations;
  @override
  final BuiltList<FundamentalDriftCitation> missingCitations;

  factory _$FundamentalDrift(
          [void Function(FundamentalDriftBuilder)? updates]) =>
      (FundamentalDriftBuilder()..update(updates))._build();

  _$FundamentalDrift._(
      {required this.totalCitations, required this.missingCitations})
      : super._();
  @override
  FundamentalDrift rebuild(void Function(FundamentalDriftBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalDriftBuilder toBuilder() =>
      FundamentalDriftBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalDrift &&
        totalCitations == other.totalCitations &&
        missingCitations == other.missingCitations;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalCitations.hashCode);
    _$hash = $jc(_$hash, missingCitations.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalDrift')
          ..add('totalCitations', totalCitations)
          ..add('missingCitations', missingCitations))
        .toString();
  }
}

class FundamentalDriftBuilder
    implements Builder<FundamentalDrift, FundamentalDriftBuilder> {
  _$FundamentalDrift? _$v;

  int? _totalCitations;
  int? get totalCitations => _$this._totalCitations;
  set totalCitations(int? totalCitations) =>
      _$this._totalCitations = totalCitations;

  ListBuilder<FundamentalDriftCitation>? _missingCitations;
  ListBuilder<FundamentalDriftCitation> get missingCitations =>
      _$this._missingCitations ??= ListBuilder<FundamentalDriftCitation>();
  set missingCitations(
          ListBuilder<FundamentalDriftCitation>? missingCitations) =>
      _$this._missingCitations = missingCitations;

  FundamentalDriftBuilder() {
    FundamentalDrift._defaults(this);
  }

  FundamentalDriftBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalCitations = $v.totalCitations;
      _missingCitations = $v.missingCitations.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalDrift other) {
    _$v = other as _$FundamentalDrift;
  }

  @override
  void update(void Function(FundamentalDriftBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalDrift build() => _build();

  _$FundamentalDrift _build() {
    _$FundamentalDrift _$result;
    try {
      _$result = _$v ??
          _$FundamentalDrift._(
            totalCitations: BuiltValueNullFieldError.checkNotNull(
                totalCitations, r'FundamentalDrift', 'totalCitations'),
            missingCitations: missingCitations.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'missingCitations';
        missingCitations.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FundamentalDrift', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
