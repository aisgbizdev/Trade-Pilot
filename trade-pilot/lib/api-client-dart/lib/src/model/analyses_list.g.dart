// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analyses_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysesList extends AnalysesList {
  @override
  final BuiltList<Analysis> analyses;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$AnalysesList([void Function(AnalysesListBuilder)? updates]) =>
      (AnalysesListBuilder()..update(updates))._build();

  _$AnalysesList._(
      {required this.analyses,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  AnalysesList rebuild(void Function(AnalysesListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysesListBuilder toBuilder() => AnalysesListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysesList &&
        analyses == other.analyses &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, analyses.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysesList')
          ..add('analyses', analyses)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class AnalysesListBuilder
    implements Builder<AnalysesList, AnalysesListBuilder> {
  _$AnalysesList? _$v;

  ListBuilder<Analysis>? _analyses;
  ListBuilder<Analysis> get analyses =>
      _$this._analyses ??= ListBuilder<Analysis>();
  set analyses(ListBuilder<Analysis>? analyses) => _$this._analyses = analyses;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  AnalysesListBuilder() {
    AnalysesList._defaults(this);
  }

  AnalysesListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _analyses = $v.analyses.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysesList other) {
    _$v = other as _$AnalysesList;
  }

  @override
  void update(void Function(AnalysesListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysesList build() => _build();

  _$AnalysesList _build() {
    _$AnalysesList _$result;
    try {
      _$result = _$v ??
          _$AnalysesList._(
            analyses: analyses.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'AnalysesList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'AnalysesList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'AnalysesList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'analyses';
        analyses.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalysesList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
