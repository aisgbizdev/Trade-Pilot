// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analyses_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysesSummary extends AnalysesSummary {
  @override
  final int totalAnalyses;
  @override
  final int beginnerCount;
  @override
  final int proCount;
  @override
  final num? avgConfidenceMin;
  @override
  final num? avgConfidenceMax;
  @override
  final BuiltList<Analysis> recentAnalyses;

  factory _$AnalysesSummary([void Function(AnalysesSummaryBuilder)? updates]) =>
      (AnalysesSummaryBuilder()..update(updates))._build();

  _$AnalysesSummary._(
      {required this.totalAnalyses,
      required this.beginnerCount,
      required this.proCount,
      this.avgConfidenceMin,
      this.avgConfidenceMax,
      required this.recentAnalyses})
      : super._();
  @override
  AnalysesSummary rebuild(void Function(AnalysesSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysesSummaryBuilder toBuilder() => AnalysesSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysesSummary &&
        totalAnalyses == other.totalAnalyses &&
        beginnerCount == other.beginnerCount &&
        proCount == other.proCount &&
        avgConfidenceMin == other.avgConfidenceMin &&
        avgConfidenceMax == other.avgConfidenceMax &&
        recentAnalyses == other.recentAnalyses;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalAnalyses.hashCode);
    _$hash = $jc(_$hash, beginnerCount.hashCode);
    _$hash = $jc(_$hash, proCount.hashCode);
    _$hash = $jc(_$hash, avgConfidenceMin.hashCode);
    _$hash = $jc(_$hash, avgConfidenceMax.hashCode);
    _$hash = $jc(_$hash, recentAnalyses.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysesSummary')
          ..add('totalAnalyses', totalAnalyses)
          ..add('beginnerCount', beginnerCount)
          ..add('proCount', proCount)
          ..add('avgConfidenceMin', avgConfidenceMin)
          ..add('avgConfidenceMax', avgConfidenceMax)
          ..add('recentAnalyses', recentAnalyses))
        .toString();
  }
}

class AnalysesSummaryBuilder
    implements Builder<AnalysesSummary, AnalysesSummaryBuilder> {
  _$AnalysesSummary? _$v;

  int? _totalAnalyses;
  int? get totalAnalyses => _$this._totalAnalyses;
  set totalAnalyses(int? totalAnalyses) =>
      _$this._totalAnalyses = totalAnalyses;

  int? _beginnerCount;
  int? get beginnerCount => _$this._beginnerCount;
  set beginnerCount(int? beginnerCount) =>
      _$this._beginnerCount = beginnerCount;

  int? _proCount;
  int? get proCount => _$this._proCount;
  set proCount(int? proCount) => _$this._proCount = proCount;

  num? _avgConfidenceMin;
  num? get avgConfidenceMin => _$this._avgConfidenceMin;
  set avgConfidenceMin(num? avgConfidenceMin) =>
      _$this._avgConfidenceMin = avgConfidenceMin;

  num? _avgConfidenceMax;
  num? get avgConfidenceMax => _$this._avgConfidenceMax;
  set avgConfidenceMax(num? avgConfidenceMax) =>
      _$this._avgConfidenceMax = avgConfidenceMax;

  ListBuilder<Analysis>? _recentAnalyses;
  ListBuilder<Analysis> get recentAnalyses =>
      _$this._recentAnalyses ??= ListBuilder<Analysis>();
  set recentAnalyses(ListBuilder<Analysis>? recentAnalyses) =>
      _$this._recentAnalyses = recentAnalyses;

  AnalysesSummaryBuilder() {
    AnalysesSummary._defaults(this);
  }

  AnalysesSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalAnalyses = $v.totalAnalyses;
      _beginnerCount = $v.beginnerCount;
      _proCount = $v.proCount;
      _avgConfidenceMin = $v.avgConfidenceMin;
      _avgConfidenceMax = $v.avgConfidenceMax;
      _recentAnalyses = $v.recentAnalyses.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysesSummary other) {
    _$v = other as _$AnalysesSummary;
  }

  @override
  void update(void Function(AnalysesSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysesSummary build() => _build();

  _$AnalysesSummary _build() {
    _$AnalysesSummary _$result;
    try {
      _$result = _$v ??
          _$AnalysesSummary._(
            totalAnalyses: BuiltValueNullFieldError.checkNotNull(
                totalAnalyses, r'AnalysesSummary', 'totalAnalyses'),
            beginnerCount: BuiltValueNullFieldError.checkNotNull(
                beginnerCount, r'AnalysesSummary', 'beginnerCount'),
            proCount: BuiltValueNullFieldError.checkNotNull(
                proCount, r'AnalysesSummary', 'proCount'),
            avgConfidenceMin: avgConfidenceMin,
            avgConfidenceMax: avgConfidenceMax,
            recentAnalyses: recentAnalyses.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'recentAnalyses';
        recentAnalyses.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalysesSummary', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
