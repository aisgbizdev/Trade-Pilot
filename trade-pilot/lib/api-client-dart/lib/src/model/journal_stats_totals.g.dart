// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_stats_totals.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$JournalStatsTotals extends JournalStatsTotals {
  @override
  final int entries;
  @override
  final int wins;
  @override
  final int losses;
  @override
  final int breakevens;
  @override
  final int open;
  @override
  final int skipped;
  @override
  final int resolved;

  factory _$JournalStatsTotals(
          [void Function(JournalStatsTotalsBuilder)? updates]) =>
      (JournalStatsTotalsBuilder()..update(updates))._build();

  _$JournalStatsTotals._(
      {required this.entries,
      required this.wins,
      required this.losses,
      required this.breakevens,
      required this.open,
      required this.skipped,
      required this.resolved})
      : super._();
  @override
  JournalStatsTotals rebuild(
          void Function(JournalStatsTotalsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalStatsTotalsBuilder toBuilder() =>
      JournalStatsTotalsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalStatsTotals &&
        entries == other.entries &&
        wins == other.wins &&
        losses == other.losses &&
        breakevens == other.breakevens &&
        open == other.open &&
        skipped == other.skipped &&
        resolved == other.resolved;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, entries.hashCode);
    _$hash = $jc(_$hash, wins.hashCode);
    _$hash = $jc(_$hash, losses.hashCode);
    _$hash = $jc(_$hash, breakevens.hashCode);
    _$hash = $jc(_$hash, open.hashCode);
    _$hash = $jc(_$hash, skipped.hashCode);
    _$hash = $jc(_$hash, resolved.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalStatsTotals')
          ..add('entries', entries)
          ..add('wins', wins)
          ..add('losses', losses)
          ..add('breakevens', breakevens)
          ..add('open', open)
          ..add('skipped', skipped)
          ..add('resolved', resolved))
        .toString();
  }
}

class JournalStatsTotalsBuilder
    implements Builder<JournalStatsTotals, JournalStatsTotalsBuilder> {
  _$JournalStatsTotals? _$v;

  int? _entries;
  int? get entries => _$this._entries;
  set entries(int? entries) => _$this._entries = entries;

  int? _wins;
  int? get wins => _$this._wins;
  set wins(int? wins) => _$this._wins = wins;

  int? _losses;
  int? get losses => _$this._losses;
  set losses(int? losses) => _$this._losses = losses;

  int? _breakevens;
  int? get breakevens => _$this._breakevens;
  set breakevens(int? breakevens) => _$this._breakevens = breakevens;

  int? _open;
  int? get open => _$this._open;
  set open(int? open) => _$this._open = open;

  int? _skipped;
  int? get skipped => _$this._skipped;
  set skipped(int? skipped) => _$this._skipped = skipped;

  int? _resolved;
  int? get resolved => _$this._resolved;
  set resolved(int? resolved) => _$this._resolved = resolved;

  JournalStatsTotalsBuilder() {
    JournalStatsTotals._defaults(this);
  }

  JournalStatsTotalsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _entries = $v.entries;
      _wins = $v.wins;
      _losses = $v.losses;
      _breakevens = $v.breakevens;
      _open = $v.open;
      _skipped = $v.skipped;
      _resolved = $v.resolved;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalStatsTotals other) {
    _$v = other as _$JournalStatsTotals;
  }

  @override
  void update(void Function(JournalStatsTotalsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalStatsTotals build() => _build();

  _$JournalStatsTotals _build() {
    final _$result = _$v ??
        _$JournalStatsTotals._(
          entries: BuiltValueNullFieldError.checkNotNull(
              entries, r'JournalStatsTotals', 'entries'),
          wins: BuiltValueNullFieldError.checkNotNull(
              wins, r'JournalStatsTotals', 'wins'),
          losses: BuiltValueNullFieldError.checkNotNull(
              losses, r'JournalStatsTotals', 'losses'),
          breakevens: BuiltValueNullFieldError.checkNotNull(
              breakevens, r'JournalStatsTotals', 'breakevens'),
          open: BuiltValueNullFieldError.checkNotNull(
              open, r'JournalStatsTotals', 'open'),
          skipped: BuiltValueNullFieldError.checkNotNull(
              skipped, r'JournalStatsTotals', 'skipped'),
          resolved: BuiltValueNullFieldError.checkNotNull(
              resolved, r'JournalStatsTotals', 'resolved'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
